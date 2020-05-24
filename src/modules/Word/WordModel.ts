import ModelBase from "../../lib/ModelBase";

export interface PropsWord {
  idword?: string;
  iduser?: string;
  letters?: string;
  images?: [string] | TImages;
  points?: number;
  dateCreated?: string;
}

export type TImages = { [key: number]: string };
export type TWord = { [key: string]: PropsWord };

export default class WordModel extends ModelBase {
  public idword: string = "";
  public iduser: string = "";
  public letters: string = "";
  public dateCreated: string = "";
  public points: number = 0;
  public images: [string] | TImages = {};
  public props: PropsWord = {};

  constructor() {
    super("word");
  }

  dataCreate(): PropsWord {
    return this.props;
  }

  incrementPoints(points: number) {
    return points + 1;
  }
}
