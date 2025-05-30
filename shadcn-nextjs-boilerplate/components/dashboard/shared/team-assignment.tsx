'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { 
  HiPlus,
  HiUser,
  HiUsers,
  HiCheck,
  HiXMark
} from 'react-icons/hi2';
import { createClient } from '@/utils/supabase/client';

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

interface TeamAssignmentProps {
  assignedTo?: string;
  teamMembers?: string[];
  onAssignedToChange?: (userId: string | null) => void;
  onTeamMembersChange?: (userIds: string[]) => void;
  mode?: 'single' | 'multiple';
  size?: 'sm' | 'md' | 'lg';
}

// Mock team members for development
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user1',
    email: 'sarah@sylo.design',
    full_name: 'Sarah Johnson',
    role: 'Lead Designer'
  },
  {
    id: 'user2', 
    email: 'mike@sylo.design',
    full_name: 'Mike Chen',
    role: 'Interior Designer'
  },
  {
    id: 'user3',
    email: 'emma@sylo.design', 
    full_name: 'Emma Rodriguez',
    role: 'Project Manager'
  },
  {
    id: 'user4',
    email: 'alex@sylo.design',
    full_name: 'Alex Thompson',
    role: 'Design Assistant'
  }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarSize = (size: string) => {
  switch (size) {
    case 'sm': return 'h-6 w-6';
    case 'lg': return 'h-10 w-10';
    default: return 'h-8 w-8';
  }
};

export default function TeamAssignment({
  assignedTo,
  teamMembers = [],
  onAssignedToChange,
  onTeamMembersChange,
  mode = 'single',
  size = 'md'
}: TeamAssignmentProps) {
  const [open, setOpen] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        
        // In a real app, we'd fetch from a team_members table
        // For now, we'll use mock data
        setAvailableMembers(mockTeamMembers);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setAvailableMembers(mockTeamMembers);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  const assignedMember = availableMembers.find(member => member.id === assignedTo);
  const assignedTeamMembers = availableMembers.filter(member => 
    teamMembers.includes(member.id)
  );

  const handleAssign = (memberId: string) => {
    if (mode === 'single') {
      onAssignedToChange?.(assignedTo === memberId ? null : memberId);
    } else {
      const newTeamMembers = teamMembers.includes(memberId)
        ? teamMembers.filter(id => id !== memberId)
        : [...teamMembers, memberId];
      onTeamMembersChange?.(newTeamMembers);
    }
    setOpen(false);
  };

  const removeTeamMember = (memberId: string) => {
    if (mode === 'single') {
      onAssignedToChange?.(null);
    } else {
      onTeamMembersChange?.(teamMembers.filter(id => id !== memberId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${getAvatarSize(size)} rounded-full bg-muted animate-pulse`} />
        <span className="circular-light text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Display assigned members */}
      {mode === 'single' && assignedMember && (
        <div className="flex items-center gap-2">
          <Avatar className={getAvatarSize(size)}>
            <AvatarImage src={assignedMember.avatar_url} />
            <AvatarFallback className="text-xs">
              {getInitials(assignedMember.full_name || assignedMember.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="circular-bold text-sm">
              {assignedMember.full_name || assignedMember.email}
            </span>
            {assignedMember.role && (
              <span className="circular-light text-xs text-muted-foreground">
                {assignedMember.role}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeTeamMember(assignedMember.id)}
          >
            <HiXMark className="h-3 w-3" />
          </Button>
        </div>
      )}

      {mode === 'multiple' && assignedTeamMembers.length > 0 && (
        <div className="flex items-center gap-1">
          {assignedTeamMembers.slice(0, 3).map((member) => (
            <div key={member.id} className="relative group">
              <Avatar className={getAvatarSize(size)}>
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.full_name || member.email)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeTeamMember(member.id)}
              >
                <HiXMark className="h-2 w-2" />
              </Button>
            </div>
          ))}
          {assignedTeamMembers.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{assignedTeamMembers.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Assignment button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {mode === 'single' ? (
              <>
                <HiUser className="h-4 w-4 mr-2" />
                {assignedMember ? 'Reassign' : 'Assign'}
              </>
            ) : (
              <>
                <HiUsers className="h-4 w-4 mr-2" />
                Add Team Member
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search team members..." />
            <CommandList>
              <CommandEmpty>No team members found.</CommandEmpty>
              <CommandGroup>
                {availableMembers.map((member) => {
                  const isSelected = mode === 'single' 
                    ? assignedTo === member.id
                    : teamMembers.includes(member.id);
                  
                  return (
                    <CommandItem
                      key={member.id}
                      onSelect={() => handleAssign(member.id)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.full_name || member.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="circular-bold text-sm">
                          {member.full_name || member.email}
                        </div>
                        {member.role && (
                          <div className="circular-light text-xs text-muted-foreground">
                            {member.role}
                          </div>
                        )}
                        <div className="circular-light text-xs text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                      {isSelected && (
                        <HiCheck className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
