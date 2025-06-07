"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GET_CHATBOT_BY_ID } from "@/graphQl/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVaraibles } from "@/types/types";
import { useMutation, useQuery } from "@apollo/client";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, redirect } from "next/navigation";
import { toast } from "sonner";
import Characteristic from "@/components/Characteristic";
import {
  ADD_CHARACTERISTIC,
  DELETE_CHATBOT,
  UPDATE_CHATBOT,
} from "@/graphQl/mutations/mutations";

const EditChatbot = () => {
  const params = useParams();
  const id = params?.id as string;

  const [chatbotUrl, setChatbotUrl] = useState("");
  const [chatbotName, setChatbotName] = useState("");
  const [newCharacteristic, setNewCharacteristic] = useState("");

  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVaraibles
  >(GET_CHATBOT_BY_ID, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const handleDelete = async () => {
    if (!id) return;
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;

    try {
      const promise = deleteChatbot({ variables: { id: Number(id) } });
      toast.promise(promise, {
        loading: "Deleting...",
        success: "Chatbot Deleted Successfully ✅",
        error: "Failed to Delete the Chatbot ❌",
      });
    } catch (error) {
      console.error("Error deleting chatbot:", error);
    }
  };

  const handleAddCharacteristic = async (content: string) => {
    if (!content || !id) return;

    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date().toISOString(),
        },
      });
      toast.promise(promise, {
        loading: "Adding characteristic...",
        success: "Characteristic added successfully ✅",
        error: "Failed to add characteristic ❌",
      });
    } catch (error) {
      console.error("Error adding characteristic:", error);
    }
  };

  const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const promise = updateChatbot({
        variables: {
          id: Number(id),
          name: chatbotName,
        },
      });
      toast.promise(promise, {
        loading: "Updating chatbot...",
        success: "Chatbot name updated successfully ✅",
        error: "Failed to update chatbot ❌",
      });
    } catch (error) {
      console.error("Error updating chatbot:", error);
    }
  };

  useEffect(() => {
    if (data?.chatbots) {
      setChatbotName(data.chatbots.name);
    }
  }, [data]);

  useEffect(() => {
    const origin = window.location.origin;
    setChatbotUrl(`${origin}/chatbot/${id}`);
  }, [id]);

  if (loading)
    return (
      <div className="mx-auto max-w-xl animate-spin p-5">
        <Avatar seed="Solve Bot Support agent" />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;
  if (!data?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="max-w-3xl relative mx-auto px-4 md:px-8 py-8">
      <div className="bg-green-700 text-white rounded-lg p-6 space-y-3 shadow-md">
        <h2 className="text-base font-semibold">Shareable Chatbot Link</h2>
        <p className="text-sm text-green-100">
          Share this link with customers:
        </p>
        <div className="flex gap-2">
          <Link href={chatbotUrl} target="_blank" className="w-full">
            <Input value={chatbotUrl} readOnly className="cursor-pointer" />
          </Link>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(chatbotUrl);
              toast.success("Copied to clipboard");
            }}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <section className="relative bg-white mt-6 p-6 rounded-lg shadow-md border">
        <Button
          className="absolute top-3 right-3 h-8 w-8 p-0"
          onClick={handleDelete}
          variant="destructive"
        >
          X
        </Button>

        <div className="flex mt-5 items-center gap-4">
          <Avatar seed={chatbotName} className="w-16 h-16" />
          <form
            onSubmit={handleUpdateChatbot}
            className="flex-1 flex items-center gap-3"
          >
            <Input
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder="Enter chatbot name"
              required
              className="text-xl font-semibold text-gray-800"
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>

        <div className="mt-10 space-y-2">
          <h2 className="text-lg md:text-xl font-semibold">
            Chatbot Knowledge Base
          </h2>
          <p className="text-sm text-gray-600">
            This is the information your chatbot uses to respond to users.
          </p>
        </div>

        <div className="mt-5 p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex-1 flex items-center gap-3"
          >
            <Input
              type="text"
              placeholder="Example: Provide price link when asked for prices"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>

          <ul className="mt-4 flex flex-wrap-reverse gap-2">
            {data.chatbots.chatbot_characteristics.length > 0 ? (
              data.chatbots.chatbot_characteristics.map((char) => (
                <Characteristic key={char.id} characteristic={char} />
              ))
            ) : (
              <li className="text-sm italic text-gray-500">
                No characteristics found.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default EditChatbot;
