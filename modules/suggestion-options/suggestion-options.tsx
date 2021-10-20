import React, {
  useCallback,
  useMemo,
  MouseEvent,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { ClickAwayListener } from '@mui/material';
import { useModalState } from 'src/common/hooks';
import { AddItemButton } from 'src/common/components';
import { OptionsIcon } from 'src/icons';
import { getRecommendedTagsState, recommendedTagsActions, useAppDispatch } from 'src/store';
import { ESortDirection, IRecommendedTag } from 'src/common/types';
import { createSortByNumber, getElementPositionViewport } from 'src/common/utils';
import { RecommendedTagRow } from '../../components';
import { NUMBER_OF_TAGS_OPTIONS } from './constants';
import styles from './suggestion-options.module.scss';

export const SuggestionOptions = React.memo(() => {
  const { isOpen, onClose, onToggle } = useModalState();
  const popupRef = useRef<HTMLDivElement>(null);
  const [isTopOpenPopup, setIsTopOpenPopup] = useState(false);
  const {
    entities: recommendedTagsObj,
    tagsNumberToShow,
  } = useSelector(getRecommendedTagsState);
  const dispatch = useAppDispatch();

  const onAddNewTag = useCallback(() => '', []);

  const recommendedTagsArr = useMemo(
    () => (Object
      .values(recommendedTagsObj) as IRecommendedTag[])
      .sort(createSortByNumber(ESortDirection.Asc, 'order')),
    [recommendedTagsObj],
  );

  const handleOptionsClick = useCallback((event: MouseEvent<SVGSVGElement>) => {
    const {
      toWindowBottom,
      toWindowTop,
    } = getElementPositionViewport(event.target as Element);
    if (
      popupRef.current
      && toWindowBottom < popupRef.current.clientHeight + 30
      && toWindowBottom < toWindowTop
    ) {
      setIsTopOpenPopup(true);
    }
    onToggle();
  }, [onToggle]);

  const onTagDelete = useCallback((id: string) => {
    dispatch(recommendedTagsActions.deleteRecommendedTag(id))
  }, [dispatch]);

  const onTagUpdate = useCallback((id: string, newTitle: string, order: number) => {
    dispatch(recommendedTagsActions.updateRecommendedTag({
      id,
      title: newTitle,
      order,
    }))
  }, [dispatch]);

  const hsndleClickTagsNumberToShow = useCallback((newValue: number) => () => {
    if (newValue !== tagsNumberToShow) {
      dispatch(recommendedTagsActions.updateTagsNumberToShow(newValue))
    }
  }, [dispatch, tagsNumberToShow]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <section className={styles.wrapper}>
        <OptionsIcon
          className={styles.options}
          onClick={handleOptionsClick}
        />
        <div
          className={cn(styles.popup, {
            [styles.top]: isTopOpenPopup,
            [styles.hidden]: !isOpen,
          })}
          ref={popupRef}
        >
          <h4>Number of tags:</h4>
          <div className={styles['tag-numbers']}>
            {
              NUMBER_OF_TAGS_OPTIONS.map(option => (
                <div
                  key={option}
                  className={cn(styles['tag-number'], {
                    [styles.active]: tagsNumberToShow === option,
                  })}
                  onClick={hsndleClickTagsNumberToShow(option)}
                >
                  {option}
                </div>
              ))
            }
          </div>
          <div className={styles['tag-selection-title-row']}>
            <h4>
              Tag selection:
            </h4>
            <AddItemButton
              text=""
              onClick={onAddNewTag}
              className={styles.add}
            />
          </div>
          <div>
            {
              recommendedTagsArr.map(recommendedTag => (
                <RecommendedTagRow
                  key={recommendedTag.id}
                  id={recommendedTag.id}
                  order={recommendedTag.order}
                  title={recommendedTag.title}
                  onDelete={onTagDelete}
                  onSave={onTagUpdate}
                />
              ))
            }
          </div>
        </div>
      </section>
    </ClickAwayListener>
  );
});
