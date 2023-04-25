import { Select } from "@chakra-ui/react";
import { subjects } from "../../data/static/subjects";

const SubjectSelector = ({
  selectSubject,
}: {
  selectSubject: (subject: string) => void;
}) => {
  return (
    <Select
      size={"lg"}
      variant="outline"
      placeholder="Select a subject..."
      onChange={(event) => selectSubject(event.target.value)}
    >
      {subjects.map((subject) => (
        <option value={subject} key={subject}>
          {subject}
        </option>
      ))}
    </Select>
  );
};

export default SubjectSelector;
