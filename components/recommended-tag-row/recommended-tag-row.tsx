import { TextField } from '@mui/material';
import React, {
  ChangeEvent,
  useCallback,
  useState,
  KeyboardEvent,
} from 'react';
import { MAX_TAG_LENGTH } from 'src/common/constants';
import { CrossIcon, EditIcon, LikeIcon } from 'src/icons';
import styles from './recommended-tag-row.module.scss';

interface IRecommendedTagRowProps {
  order: number;
  title: string;
  id: string;
  onDelete: (id: string) => void;
  onSave: (id: string, title: string, order: number) => void;
}

export const RecommendedTagRow = React.memo<IRecommendedTagRowProps>(({
  order,
  title,
  id,
  onDelete,
  onSave,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const handleClickEdit = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleClickDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const handleClickSave = useCallback(() => {
    if (inputValue.length) {
      onSave(id, inputValue, order);
    }
    setIsEditMode(false);
  }, [id, inputValue, onSave, order]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.target.value.length <= MAX_TAG_LENGTH) {
      setInputValue(event.target.value);
    }
  }, []);

  const handleEnterPressed = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClickSave();
    }
  }, [handleClickSave]);

  return (
    <div className={styles.wrapper}>
      <b className={styles.order}>
        {`${order}.`}
      </b>
      {
        isEditMode
          ? (
            <TextField
              className={styles.input}
              variant="standard"
              value={inputValue}
              helperText={`${inputValue.length}/${MAX_TAG_LENGTH}`}
              onChange={handleInputChange}
              onKeyDown={handleEnterPressed}
            />
          )
          : (
            <p className={styles.title}>
              {title}
            </p>
          )
      }
      <div className={styles.icons}>
        {
          isEditMode
            ? (
              <LikeIcon
                className={styles.icon}
                onClick={handleClickSave}
              />
            )
            : (
              <EditIcon
                className={styles.icon}
                onClick={handleClickEdit}
              />
            )
        }
        <CrossIcon
          className={styles.icon}
          onClick={handleClickDelete}
        />
      </div>
    </div>
  );
});
