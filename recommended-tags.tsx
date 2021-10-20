import { ClickAwayListener, TextField } from '@mui/material';
import React, {
  useCallback,
  useMemo,
  useState,
  KeyboardEvent,
} from 'react';
import { useSelector } from 'react-redux';
import { ExpandIcon } from 'src/common/components';
import { MAX_TAG_LENGTH } from 'src/common/constants';
import { useModalState } from 'src/common/hooks';
import { IRecommendedTag } from 'src/common/types';
import { generateNewIdV4 } from 'src/common/utils';
import { getRecommendedTagsState } from 'src/store';
import { Suggestions } from './components';
import { SuggestionOptions } from './modules';
import { getFilteredRecommendedTags } from './utils';
import styles from './recommended-tags.module.scss';

interface IRecommendedTagsProps {
  onTagSave: (tag: Omit<IRecommendedTag, 'order'>) => void;
}

export const RecommendedTags = React.memo<IRecommendedTagsProps>(({
  onTagSave,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { isOpen, onOpen, onClose, onToggle } = useModalState();
  const {
    entities: recommendedTagsObj,
    tagsNumberToShow,
  } = useSelector(getRecommendedTagsState);

  const recommendedTagsArr = useMemo(() => getFilteredRecommendedTags(
    recommendedTagsObj,
    tagsNumberToShow,
    inputValue,
  ), [inputValue, recommendedTagsObj, tagsNumberToShow]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= MAX_TAG_LENGTH) {
      setInputValue(event.target.value);
    }
  }, []);

  const handleChooseRecommended = useCallback((event: React.SyntheticEvent<HTMLDivElement>) => {
    const choosenTag = recommendedTagsArr.find(
      recommendedTag => recommendedTag.id === event.currentTarget.dataset.id,
    ) as IRecommendedTag;
    onClose();
    setInputValue('');
    onTagSave(choosenTag);
  }, [onClose, onTagSave, recommendedTagsArr]);

  const handleEnterPressed = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const enteredTag = {
        title: inputValue,
        id: generateNewIdV4(),
      }
      onTagSave(enteredTag);
      setInputValue('');
    }
  }, [inputValue, onTagSave]);

  return (
    <section className={styles.wrapper}>
      <ClickAwayListener onClickAway={onClose}>
        <div className={styles['input-and-recommended']}>
          <TextField
            className={styles.input}
            onClick={onOpen}
            variant="outlined"
            placeholder="Tags"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleEnterPressed}
          />
          <ExpandIcon
            isOpen={isOpen}
            className={styles.icon}
            onClick={onToggle}
          />
          <Suggestions
            isOpen={isOpen}
            onClick={handleChooseRecommended}
            recommendedTags={recommendedTagsArr}
          />
        </div>
      </ClickAwayListener>
      <SuggestionOptions />
      <div />
    </section>
  );
});
