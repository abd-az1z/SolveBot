import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateChatbot = () => {
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
        <form className="space-y-4">
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
              placeholder="e.g. SupportBot"
              required
            />
          </div>
          <Button className="w-full  bg-[#389f38e3] hover:bg-[#389f38] text-white font-medium rounded-lg transition duration-200">
            Create Chatbot
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CreateChatbot;
