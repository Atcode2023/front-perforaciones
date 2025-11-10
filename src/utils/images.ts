import { IMG_URL } from 'src/utils/imgConfig';

export const publicUrl = (url: string) => {
  return `${IMG_URL}/${url}`;
};
