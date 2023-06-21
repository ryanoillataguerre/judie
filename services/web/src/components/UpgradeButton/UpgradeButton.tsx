import { useState } from "react";
import Paywall from "@judie/components/Paywall/Paywall";
import { Button } from "@chakra-ui/react";

const UpgradeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Paywall isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <Button
        variant="outline"
        colorScheme="green"
        style={{
          width: "100%",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        Upgrade now 🚀
      </Button>
    </>
  );
};

export default UpgradeButton;
