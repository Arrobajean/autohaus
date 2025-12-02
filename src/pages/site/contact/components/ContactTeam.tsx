import ContactTeamMember from "./ContactTeamMember";
import { teamMembers } from "../data/contactData";

interface ContactTeamProps {
  compact?: boolean;
}

const ContactTeam = ({ compact = true }: ContactTeamProps) => {
  return (
    <section className="px-4 md:px-8 mb-12 md:mb-20 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {teamMembers.map((member) => (
          <ContactTeamMember key={member.id} member={member} compact={compact} />
        ))}
      </div>
    </section>
  );
};

export default ContactTeam;

