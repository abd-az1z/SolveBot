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
    variables: { characteristicId: characteristic.id },
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const handleRemove = async () => {
    const promise = removeCharacteristic();
    toast.promise(promise, {
      loading: "Removing... ⏳",
      success: "Characteristic removed successfully ✅",
      error: "Failed to remove the characteristic ❌",
    });
  };

  return (
    <li
      key={characteristic.id}
      className="relative p-5 hover:border-gray-600 bg-gray-100 border border-gray-200 shadow rounded-md"
    >
      {characteristic.content}
      <CircleX
        onClick={handleRemove}
        className="w-6 h-6 text-white fill-red-500 absolute -top-2 -right-2 cursor-pointer hover:opacity-50"
      />
    </li>
  );
};

export default Characteristic;
