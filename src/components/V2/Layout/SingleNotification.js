import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SingleNotification = ({ content, date, avatar, seen }) => (
  <div className="flex items-center justify-between">
      <div className="flex items-center">
          <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-5">
              <p className="text-foreground text-md">{content}</p>
              <p className="text-foreground/[.2]">{date}</p>
          </div>
      </div>

      {!seen && <div className="h-1.5 w-1.5 bg-accent rounded-full shrink-0" />}
  </div>
);

export default SingleNotification;
