import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { School } from "@judie/data/types/api";
import { useRouter } from "next/router";
import DeleteSchoolModal from "../DeleteSchoolModal";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const SchoolsTable = ({ schools }: { schools: School[] }) => {
  const router = useRouter();
  const rowBackgroundColor = useColorModeValue("gray.100", "gray.700");
  const [deleteSchoolId, setDeleteSchoolId] = useState<string | null>();
  const [deleteSchoolName, setDeleteSchoolName] = useState<string | null>();

  const openDeleteModal = (roomId: string, schoolName: string) => {
    setDeleteSchoolId(roomId);
    setDeleteSchoolName(schoolName);
  };

  return (
    <TableContainer>
      {deleteSchoolId && (
        <DeleteSchoolModal
          schoolId={deleteSchoolId}
          schoolName={deleteSchoolName}
          isOpen={!!deleteSchoolId}
          onClose={() => {
            setDeleteSchoolId(null);
            setDeleteSchoolName(null);
          }}
        />
      )}
      <Table variant={"simple"} size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {schools?.map((school) => (
            <Tr
              key={school.id}
              _hover={{
                backgroundColor: rowBackgroundColor,
                transition: "ease-in-out 0.3s",
              }}
            >
              <Td
                onClick={() => {
                  router.push(`/admin/schools/${school.id}`);
                }}
                cursor={"pointer"}
              >
                {school.name}
              </Td>
              <Td>
                <Button
                  size="sm"
                  variant={"ghost"}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    openDeleteModal(school.id, school.name);
                  }}
                >
                  <FaTrashAlt size={16} color={"red"} />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default SchoolsTable;
