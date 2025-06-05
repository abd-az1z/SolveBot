"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphQl/mutations/mutations";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const CreateChatbot = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();

  const [createChatbot, { data, loading, error }] = useMutation(CREATE_CHATBOT);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.id || !name) return;

    try {
      const promise = createChatbot({
        variables: {
          clerk_user_id: user.id,
          name,
          created_at: new Date().toISOString(),
        },
      });

      toast.promise(promise, {
        loading: "Creating chatbot...",
        success: "Chatbot created successfully ✅",
        error: "Failed to create chatbot ❌",
      });

      const response = await promise;

      if (!response?.data?.insertChatbots?.id) {
        console.error("❌ Bot not created:", JSON.stringify(response, null, 2));
        if (response?.errors) {
          toast.error(`❌ StepZen Error: ${response.errors[0].message}`);
        }
      } else {
        const botId = response.data.insertChatbots.id;
        setName("");
        router.push(`/edit-chatbot/${botId}`);
      }
    } catch (err) {
      console.error("❌ Apollo Error:", err);
    }
  };

  return (
    <section className="w-full">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-6 w-full">
        {/* Avatar */}
        <div className="flex justify-center">
          <Avatar seed="create-chatbot" className="w-20 h-20" />
        </div>

        {/* Headings */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create a Chatbot
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Start building your chatbot to assist your customers intelligently.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="chatbotName"
              className="block mb-1  text-sm font-medium text-gray-700"
            >
              Chatbot Name
            </label>
            <Input
              id="chatbotName"
              name="chatbotName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="e.g. SupportBot"
              required
            />
          </div>
          <Button
            disabled={loading || !name}
            className="w-full  bg-[#389f38e3] hover:bg-[#389f38] text-white font-medium rounded-lg transition duration-200"
          >
            {loading ? "Creating..." : "Create Chatbot"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CreateChatbot;