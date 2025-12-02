import RollingTextButton from "@/components/common/RollingTextButton";
import { TeamMember } from "../data/contactData";

interface ContactTeamMemberProps {
  member: TeamMember;
  compact?: boolean;
}

const ContactTeamMember = ({ member, compact = true }: ContactTeamMemberProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${member.gradientFrom} ${member.gradientTo} flex items-center justify-center text-white text-xl font-bold`}
          >
            {member.initials}
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-center">
        <h3
          className="text-xl font-bold text-black mb-1"
          style={{ textAlign: "center" }}
        >
          {member.name}
        </h3>
        <p
          className="text-gray-600 mb-4 text-sm"
          style={{ textAlign: "center" }}
        >
          {member.position}
        </p>
        {!compact && member.experience && (
          <p
            className="text-gray-500 mb-3 text-xs font-medium"
            style={{ textAlign: "center" }}
          >
            {member.experience}
          </p>
        )}
        {!compact && member.bio && (
          <p
            className="text-gray-600 mb-4 text-sm leading-relaxed px-2"
            style={{ textAlign: "center" }}
          >
            {member.bio}
          </p>
        )}
        {!compact && member.specialties && member.specialties.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4 px-2">
            {member.specialties.map((specialty, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
        <div
          className="flex justify-center"
          style={{ padding: "2px 0", minHeight: "50px" }}
        >
          <RollingTextButton
            primaryText={member.primaryText}
            secondaryText={member.secondaryText}
            to="#contact-form"
            ariaLabel={member.ariaLabel}
            backgroundColor="bg-black"
            textColor="text-white"
            className="text-base px-6 py-3"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactTeamMember;

