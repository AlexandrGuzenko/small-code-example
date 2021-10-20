import { Dictionary } from '@reduxjs/toolkit';
import { ESortDirection, IRecommendedTag } from 'src/common/types';
import { createSortByNumber } from 'src/common/utils';

export const getFilteredRecommendedTags = (
  recommendedTagsObj: Dictionary<IRecommendedTag>,
  maxNumberTags: number,
  enteredTagName: string,
) => {
  const recommendedTagsArr = Object.values(recommendedTagsObj) as IRecommendedTag[];
  const filteredRecommendedTags = recommendedTagsArr.filter(tag => tag.title.includes(enteredTagName));

  return filteredRecommendedTags
    .sort(createSortByNumber(ESortDirection.Asc, 'order'))
    .slice(0, maxNumberTags);
};
