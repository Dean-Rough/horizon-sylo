# Projects API Documentation

## Endpoints

### GET /api/projects
Fetch projects with pagination, filtering, and sorting.

#### Query Parameters
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `status` (string): Filter by project status
- `priority` (string): Filter by priority level
- `client_id` (string): Filter by client
- `assigned_to` (string): Filter by assigned user
- `start_date_from` (date): Filter by start date range start
- `start_date_to` (date): Filter by start date range end
- `search` (string): Search in name and description
- `sort_by` (string, default: 'created_at'): Field to sort by
- `sort_order` (string, default: 'desc'): Sort direction ('asc' or 'desc')
- `include` (string): Comma-separated list of related data to include

#### Response
\`\`\`json
{
  "data": Project[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "total_pages": number
  }
}
\`\`\`

### POST /api/projects
Create a new project.

#### Request Body
\`\`\`typescript
{
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  client_id?: string;
  budget_min?: number;
  budget_max?: number;
  start_date?: string;
  target_completion_date?: string;
  assigned_to?: string;
  team_members?: string[];
}
\`\`\`

#### Validation
- Name is required
- Valid status and priority values
- Valid date formats
- Budget min cannot exceed budget max

### PUT /api/projects
Update an existing project.

#### Request Body
\`\`\`typescript
{
  id: string;
  // Any updateable project fields
}
\`\`\`

#### Validation
- Valid status transitions:
  - planning → in_progress, cancelled
  - in_progress → review, on_hold, cancelled
  - review → completed, in_progress, on_hold
  - completed → in_progress
  - on_hold → in_progress, cancelled
  - cancelled → planning
- Team members array must include project creator
- Valid date formats
- Budget min cannot exceed budget max

### DELETE /api/projects
Soft delete a project.

#### Query Parameters
- `id` (string, required): Project ID

#### Restrictions
- Only projects in 'planning' or 'cancelled' status can be deleted
- Only the project creator can delete the project

## Types

### ProjectStatus
\`\`\`typescript
type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
\`\`\`

### Priority
\`\`\`typescript
type Priority = 'low' | 'medium' | 'high' | 'urgent';
\`\`\`

### Project
\`\`\`typescript
interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  client_id: string;
  budget_min: number | null;
  budget_max: number | null;
  start_date: string | null;
  target_completion_date: string | null;
  created_by: string;
  assigned_to: string | null;
  team_members: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
\`\`\`

## Examples

### Fetch Projects with Pagination
\`\`\`typescript
const response = await fetch('/api/projects?page=1&limit=10');
\`\`\`

### Search and Filter Projects
\`\`\`typescript
const response = await fetch('/api/projects?status=in_progress&priority=high&search=renovation');
\`\`\`

### Include Related Data
\`\`\`typescript
const response = await fetch('/api/projects?include=tasks,materials');
\`\`\`

### Create Project
\`\`\`typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Project',
    description: 'Project description',
    status: 'planning',
    priority: 'high'
  })
});
\`\`\`

### Update Project Status
\`\`\`typescript
const response = await fetch('/api/projects', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'project-id',
    status: 'in_progress'
  })
});
\`\`\`

### Delete Project
\`\`\`typescript
const response = await fetch('/api/projects?id=project-id', {
  method: 'DELETE'
});
\`\`\`
