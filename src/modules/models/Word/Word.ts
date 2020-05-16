import Model from "../Model";
import { status, createKeyDocument } from "../../utils/helpers";
import { IWord } from "./WordInterface";
import { IPagination } from "../../config/firebase";

class Word extends Model {
    constructor() {
        super("word");
    }

    /**
     * Create new word with basic and default parameters
     * @param properties get properties of user (iduser, letters, images, points)
     */
    create = (properties: IWord, request: Function) => {
        const { iduser, letters, images, points , dateCreated } = properties;
        const idword = createKeyDocument(this.name, this.db);
        return this.db.ref(this.name + "/" + idword).set({ iduser, letters, images, points , dateCreated }, error => {
            request(status(error));
        });
    }

    /**
     * Returns all the words
     * @param request callback to get the response
     */
    read = (properties: IPagination,request: Function) => {
        const { start , limit } = properties;
        const abs = (val : number) => Math.abs(val);
        return this.db.ref(this.name)
        .orderByChild("letters")
        .startAt(abs(start || 0))
        .limitToFirst(abs(limit ||10))
        .once('value').then(data => request(data.toJSON()));
    }

    /**
     * Returns all the data included in this word
     * @param idword id of word
     * @param request callback to get the response
     */
    byId = (idword: string, request: Function) => {
        return this.db.ref(this.name + "/" + idword).once('value', data => request(data.toJSON()));
    }

    /**
     * Update the data of one word
     * @param parametersWord
     * @param request callback to get the response
     */
    updateWord = ( properties : IWord , request : Function ) => {
        const { idword , ...restParams } = properties;
        const wordSelected = this.db.ref(this.name + "/" + idword);
        const insertParameters : {[key:string] : any} = restParams;
        async function run(){
            for ( let key in insertParameters ) {
                await wordSelected.child(key).set(insertParameters[key]);
            }
        }
        const complete = Promise.resolve(run()).then(error=>{
            return request(status(error));
        });
        return complete;
    }

    /**
     * Increase word points when discovered correctly
     * @param idword id of word
     * @param request callback to get the response
     */
    incrementPoints = ( properties : IWord , request: Function) => {
        const { idword } = properties;
        const wordSelected = this.db.ref(this.name + "/" + idword);
        const transaction = wordSelected.child("points").transaction(points => points + 1, error => {
            return request(status(error));
        });
        return transaction;
    }
}


export default Word;