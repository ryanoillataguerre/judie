import { Select } from "@chakra-ui/react";
import { subjects } from "../../data/static/subjects";
import { useMemo } from "react";
import useAuth from "@judie/hooks/useAuth";

const SubjectSelector = ({
  selectSubject,
}: {
  selectSubject: (subject: string) => void;
}) => {
  const { userData } = useAuth();
  const subjectOptions = useMemo(() => {
    // Add content creation for Alex
    if (userData?.email?.includes("@judie.io")) {
      return [...subjects, "Content Creation"];
    }
    return subjects;
  }, [subjects, userData]);
  return (
    <Select
      size={"lg"}
      variant="outline"
      placeholder="Select a subject..."
      onChange={(event) => selectSubject(event.target.value)}
    >
      {subjectOptions.map((subject) => (
        <option value={subject} key={subject}>
          {subject}
        </option>
      ))}
    </Select>
  );
};

export default SubjectSelector;
