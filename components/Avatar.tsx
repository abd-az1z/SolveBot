import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { rings } from "@dicebear/collection";

const Avatar = ({ seed, className }: { seed: string; className?: string }) => {
  const avatar = createAvatar(rings, {
    seed,
  });

  const svg = avatar.toString(); // ✅ correct assignment
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return (
    <Image
      src={dataUrl}
      alt="user-avatar"
      width={80}
      height={80}
      className={className}
    />
  );
};

export default Avatar;