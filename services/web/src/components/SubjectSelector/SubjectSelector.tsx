import { Select } from "@chakra-ui/react";
import { adminSubjects, subjects } from "../../data/static/subjects";
import { useMemo } from "react";
import useAuth from "@judie/hooks/useAuth";

// TODO: Migrate
const SubjectSelector = ({
  selectSubject,
}: {
  selectSubject: (subject: string) => void;
}) => {
  const { userData } = useAuth();
  const subjectOptions = useMemo(() => {
    // Add content creation for Alex
    if (userData?.email?.includes("@judie.io")) {
      return [...subjects, ...adminSubjects];
    }
    return subjects;
  }, [userData]);
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
