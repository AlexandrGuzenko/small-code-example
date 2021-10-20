import React from 'react';
import { IRecommendedTag } from 'src/common/types';
import styles from './suggestions.module.scss';

interface ISuggestionsProps {
  isOpen: boolean;
  recommendedTags: IRecommendedTag[];
  onClick: (event: React.SyntheticEvent<HTMLDivElement>) => void;
}

export const Suggestions = React.memo<ISuggestionsProps>(({
  isOpen,
  recommendedTags,
  onClick,
}) => {
  if (!isOpen) {
    return null;
  }

  if (!recommendedTags.length) {
    return (
      <div className={styles.empty}>
        no suggestions available
      </div>
    );
  }
  return (
    <div className={styles.suggestions}>
      {
        recommendedTags.map((recommendedTag) => (
          <div
            key={recommendedTag.id}
            className={styles.recommended}
            data-id={recommendedTag.id}
            onClick={onClick}
          >
            {recommendedTag.title}
          </div>
        ))
      }
    </div>
  );
});
