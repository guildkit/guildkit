import { useState, type ComponentProps, type ReactElement } from "react";
import { SEPARATORS, WithContext as TagInput, type Tag } from "react-tag-input";
import { commonClasses, ErrorMessage, FieldHeadings, validClasses, type CommonFieldProps } from "./FieldCommons.tsx";

type Props = CommonFieldProps & {
  tags: Tag[];
} & Omit<
  ComponentProps<typeof TagInput>,
  "autoFocus"
>;

export const TagField = ({
  tags: selectableTags,
  label,
  description,
  required = false,
  name,
  className,
  errorMessages,
  ...formProps
}: Props): ReactElement => {
  const selectableTagIds = selectableTags.map((tag) => tag.id);
  const [ tags, setTags ] = useState<Tag[]>([]);

  const handleDelete = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  const onTagUpdate = (index: number, newTag: Tag) => {
    const updatedTags = [ ...tags ];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };

  const handleAddition = (newTag: Tag) => {
    if (!selectableTagIds.includes(newTag.id)) {
      return;
    }

    setTags((prevTags) => {
      return [ ...prevTags, newTag ];
    });
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
  };

  return (
    <div className={className}>
      <FieldHeadings
        label={label}
        description={description}
        required={required}
        name={name}
      />

      <TagInput
        id={name}
        tags={tags}
        suggestions={selectableTags}
        separators={[ SEPARATORS.ENTER, SEPARATORS.COMMA ]}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        onTagUpdate={onTagUpdate}
        inputProps={{ autoComplete: "off" }}
        maxTags={4}
        allowUnique
        classNames={{
          tags: `${ commonClasses } ${ validClasses } flex align-center gap-3 justify-between`,
          selected: "flex gap-1 w-full",
          tag: "flex gap-2.5 text-gray-200 bg-gray-600 pt-1 pb-1 pl-2 pr-2",
          remove: "cursor-pointer",
          tagInput: "align-center grow-1 relative",
          tagInputField: "outline-none w-full",
          suggestions: "absolute top-9 left-0 pt-2.5 pb-2.5 pl-2.5 pr-2.5 bg-white outline-0 border-1 border-solid border-gray-300 rounded-lg cursor-pointer",
          activeSuggestion: "bg-gray-200",
        }}
        {...formProps}
      />

      {tags.map((tag) => (<input type="hidden" name={name} value={tag.id} key={tag.id} />))}

      {errorMessages?.[0] && (
        <ErrorMessage>{errorMessages[0]}</ErrorMessage>
      )}
    </div>
  );
};
