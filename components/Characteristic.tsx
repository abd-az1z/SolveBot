"use client";

import { ChatbotCharacteristic } from "@/types/types";
import { CircleX } from "lucide-react";
import { useMutation } from "@apollo/client";
import React from "react";
import { REMOVE_CHARACTERISTIC } from "@/graphQl/mutations/mutations";
import { toast } from "sonner";

const Characteristic = ({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) => {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleRemoveCharacteristic = async (characteristicId: number) => {
    try {
      await removeCharacteristic({
        variables: {
          characteristicId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <li className="relative p-5 hover:border-gray-600 bg-gray-100 border border-gray-200 shadow rounded-md ">
      {characteristic.content}
      <CircleX
        onClick={() => {
          const promise = handleRemoveCharacteristic(characteristic.id);
          toast.promise(promise, {
            loading: "Removing... ⏳",
            success: "Characteristic Removed Successfully ✅ ",
            error: "Failed to Remove the Characteristic ❌",
          });
        }}
        className="w-6-h-6 text-white fill-red-500  absolute top-0 right-0 cursor-pointer hover:opacity-50    "
      />
    </li>
  );
};
export default Characteristic;
