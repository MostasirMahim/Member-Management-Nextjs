import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Venue } from "@/lib/dummy";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Venue #{venue.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{venue.street_address}</p>
          <p className="text-sm text-muted-foreground">
            {venue.city}, {venue.state_province} {venue.postal_code}
          </p>
          <p className="text-sm text-muted-foreground">{venue.country}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant={venue.is_active ? "default" : "secondary"}>
            {venue.is_active ? "Active" : "Inactive"}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Updated: {new Date(venue.updated_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
