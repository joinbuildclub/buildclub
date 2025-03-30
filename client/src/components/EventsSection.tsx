import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface EventCardProps {
  date: string;
  title: string;
  description: string;
  location: string;
  imageSrc: string;
  color: "primary" | "secondary" | "accent";
}

function EventCard({ date, title, description, location, imageSrc, color }: EventCardProps) {
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-[#7928CA]", 
    accent: "bg-[#0D9488]"
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className="h-48 relative">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        <div className={`absolute top-4 left-4 ${colorClasses[color]} text-white text-sm font-medium px-3 py-1 rounded-full`}>
          {date}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  return (
    <section id="events" className="py-20 bg-white bg-gradient-to-tr from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Upcoming <span className="bg-gradient-to-r from-primary to-[#7928CA] text-transparent bg-clip-text">Events</span></h2>
          <p className="text-lg text-muted-foreground">Join us for in-person gatherings where we collaborate, learn, and build together.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <EventCard 
            date="Jun 15, 2023"
            title="AI Product Workshop"
            description="Learn how to identify and validate AI product opportunities with practical exercises and expert feedback."
            location="San Francisco, CA"
            imageSrc="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3269&q=80"
            color="primary"
          />
          
          <EventCard 
            date="Jul 8-9, 2023"
            title="AI Design Hackathon"
            description="A weekend-long event where designers tackle AI interface challenges and create innovative solutions."
            location="New York, NY"
            imageSrc="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            color="secondary"
          />
          
          <EventCard 
            date="Jul 22, 2023"
            title="AI Engineering Summit"
            description="Deep dive into the latest AI engineering practices with hands-on workshops and technical discussions."
            location="Austin, TX"
            imageSrc="https://images.unsplash.com/photo-1582192730841-2a682d7375f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
            color="accent"
          />
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-medium px-6 py-6 rounded-full h-auto"
          >
            View all events
          </Button>
        </div>
      </div>
    </section>
  );
}
