import { imgUrl } from 'src/boot/axios';

export const publicUrl = (url: string) => {
  return `${imgUrl}/${url}`;
};
