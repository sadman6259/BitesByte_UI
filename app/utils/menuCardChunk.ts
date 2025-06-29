import { SimpleMenuType } from "../type/SimpleMenuType";

export const chunkArray = (array: SimpleMenuType[], size: number) => {
    const chunks: SimpleMenuType[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
};