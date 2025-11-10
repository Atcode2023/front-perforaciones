import { getImgUrl } from 'src/utils/apiClient';

export const publicUrl = async (url: string) => {
  const imgUrl = await getImgUrl();
  return `${imgUrl}/${url}`;
};
