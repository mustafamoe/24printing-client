import { IImage } from "./image";

export interface IDesigner {
    designer_id: string;
    image: IImage;
    overlay: IImage;
}
