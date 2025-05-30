/**
 * Sylo-core Usage Examples
 * 
 * This file demonstrates various ways to use the Sylo-core AI orchestration engine
 */

import { executeCommand } from './index';

// Example user context
const exampleUser = {
  id: 'user-123',
  email: 'designer@example.com',
  role: 'designer'
};

/**
 * Example 1: Create a complete project workflow
 */
export async function createProjectWorkflow() {
  console.log('🏗️ Creating a complete project workflow...');

  try {
    // Step 1: Create a new project
    const project = await executeCommand(
      'create_project',
      {
        name: 'Modern Living Room Redesign',
        description: 'Complete redesign of a contemporary living room with sustainable materials',
        status: 'planning',
        priority: 'high',
        budget_min: 15000,
        budget_max: 25000,
        start_date: '2024-02-01',
        target_completion_date: '2024-04-15'
      },
      exampleUser
    );

    if (!project.success) {
      throw new Error(`Failed to create project: ${project.error?.message}`);
    }

    console.log('✅ Project created:', project.data.name);
    const projectId = project.data.id;

    // Step 2: Create project tasks
    const tasks = [
      {
        title: 'Initial Client Consultation',
        description: 'Meet with client to understand requirements and preferences',
        priority: 'urgent',
        estimated_hours: 2
      },
      {
        title: 'Space Measurement and Assessment',
        description: 'Measure the space and assess current conditions',
        priority: 'high',
        estimated_hours: 4
      },
      {
        title: 'Design Concept Development',
        description: 'Create initial design concepts and mood boards',
        priority: 'high',
        estimated_hours: 16
      },
      {
        title: 'Material Selection',
        description: 'Select sustainable materials and furnishings',
        priority: 'medium',
        estimated_hours: 8
      },
      {
        title: 'Final Design Presentation',
        description: 'Present final design to client for approval',
        priority: 'high',
        estimated_hours: 3
      }
    ];

    const createdTasks = [];
    for (const taskData of tasks) {
      const task = await executeCommand(
        'create_task',
        {
          ...taskData,
          project_id: projectId,
          status: 'todo'
        },
        exampleUser
      );

      if (task.success) {
        createdTasks.push(task.data);
        console.log(`✅ Task created: ${task.data.title}`);
      }
    }

    // Step 3: Add sustainable materials to the project
    const materials = [
      {
        name: 'Bamboo Flooring - Natural',
        category: 'flooring',
        supplier: 'EcoFloor Solutions',
        unit_cost: 8.50,
        unit_type: 'sqft',
        sustainability_rating: 9,
        specifications: {
          thickness: '12mm',
          finish: 'Natural',
          installation: 'Click-lock'
        }
      },
      {
        name: 'Recycled Cotton Sofa',
        category: 'furniture',
        supplier: 'Green Living Furniture',
        unit_cost: 1200,
        unit_type: 'piece',
        sustainability_rating: 8,
        specifications: {
          dimensions: '84" x 36" x 32"',
          fabric: '100% Recycled Cotton',
          frame: 'FSC Certified Wood'
        }
      },
      {
        name: 'Low-VOC Paint - Sage Green',
        category: 'paint',
        supplier: 'Natural Paints Co',
        unit_cost: 45,
        unit_type: 'gallon',
        sustainability_rating: 9,
        specifications: {
          color: 'Sage Green',
          finish: 'Eggshell',
          coverage: '400 sqft per gallon'
        }
      }
    ];

    const addedMaterials = [];
    for (const materialData of materials) {
      const material = await executeCommand(
        'add_material',
        materialData,
        exampleUser
      );

      if (material.success) {
        addedMaterials.push(material.data);
        console.log(`✅ Material added: ${material.data.name}`);

        // Assign material to project
        await executeCommand(
          'assign_material_to_project',
          {
            material_id: material.data.id,
            project_id: projectId,
            quantity: materialData.name.includes('Flooring') ? 500 : 
                     materialData.name.includes('Sofa') ? 1 : 2
          },
          exampleUser
        );
      }
    }

    console.log(`🎉 Project workflow created successfully!`);
    console.log(`   📁 Project: ${project.data.name}`);
    console.log(`   📋 Tasks: ${createdTasks.length} created`);
    console.log(`   🧱 Materials: ${addedMaterials.length} added`);

    return {
      project: project.data,
      tasks: createdTasks,
      materials: addedMaterials
    };

  } catch (error) {
    console.error('❌ Failed to create project workflow:', error);
    throw error;
  }
}

/**
 * Example 2: Project management operations
 */
export async function projectManagementExample() {
  console.log('📊 Demonstrating project management operations...');

  try {
    // Get all active projects
    const activeProjects = await executeCommand(
      'list_projects',
      {
        status: 'in_progress',
        limit: 10,
        sort_by: 'priority',
        sort_order: 'desc'
      },
      exampleUser
    );

    console.log(`📋 Found ${activeProjects.data?.data?.length || 0} active projects`);

    // Get overdue tasks across all projects
    const overdueTasks = await executeCommand(
      'get_overdue_tasks',
      {},
      exampleUser
    );

    console.log(`⏰ Found ${overdueTasks.data?.length || 0} overdue tasks`);

    // Get high-sustainability materials
    const sustainableMaterials = await executeCommand(
      'get_materials_by_sustainability',
      { rating: 9 },
      exampleUser
    );

    console.log(`🌱 Found ${sustainableMaterials.data?.length || 0} highly sustainable materials`);

    return {
      activeProjects: activeProjects.data?.data || [],
      overdueTasks: overdueTasks.data || [],
      sustainableMaterials: sustainableMaterials.data || []
    };

  } catch (error) {
    console.error('❌ Project management example failed:', error);
    throw error;
  }
}

/**
 * Example 3: Task board operations (Kanban-style)
 */
export async function taskBoardExample(projectId: string) {
  console.log('📋 Demonstrating task board operations...');

  try {
    // Get all tasks for the project
    const allTasks = await executeCommand(
      'get_tasks_by_project',
      { project_id: projectId },
      exampleUser
    );

    console.log(`📋 Project has ${allTasks.data?.length || 0} tasks`);

    if (allTasks.data && allTasks.data.length > 0) {
      const firstTask = allTasks.data[0];

      // Move task through workflow stages
      const stages = [
        { column: 'todo', status: 'todo' },
        { column: 'in_progress', status: 'in_progress' },
        { column: 'review', status: 'review' },
        { column: 'completed', status: 'completed' }
      ];

      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        
        // Move task to new column
        await executeCommand(
          'move_task',
          {
            id: firstTask.id,
            board_column: stage.column,
            position: 0
          },
          exampleUser
        );

        // Update task status
        await executeCommand(
          'update_task_status',
          {
            id: firstTask.id,
            status: stage.status
          },
          exampleUser
        );

        console.log(`✅ Moved task to ${stage.column}`);

        // Simulate some work time
        if (i < stages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`🎉 Task workflow completed for: ${firstTask.title}`);
    }

  } catch (error) {
    console.error('❌ Task board example failed:', error);
    throw error;
  }
}

/**
 * Example 4: Material library management
 */
export async function materialLibraryExample() {
  console.log('🧱 Demonstrating material library management...');

  try {
    // Search for flooring materials
    const flooringMaterials = await executeCommand(
      'get_materials_by_category',
      { category: 'flooring' },
      exampleUser
    );

    console.log(`🏠 Found ${flooringMaterials.data?.length || 0} flooring materials`);

    // Get materials in budget range
    const budgetMaterials = await executeCommand(
      'get_materials_in_price_range',
      { min_cost: 10, max_cost: 100 },
      exampleUser
    );

    console.log(`💰 Found ${budgetMaterials.data?.length || 0} materials in budget range`);

    // Get all suppliers
    const suppliers = await executeCommand(
      'get_material_suppliers',
      {},
      exampleUser
    );

    console.log(`🏪 Found ${suppliers.data?.length || 0} suppliers`);

    // Search materials by keyword
    const searchResults = await executeCommand(
      'search_materials',
      { query: 'sustainable' },
      exampleUser
    );

    console.log(`🔍 Found ${searchResults.data?.length || 0} materials matching 'sustainable'`);

    return {
      flooringMaterials: flooringMaterials.data || [],
      budgetMaterials: budgetMaterials.data || [],
      suppliers: suppliers.data || [],
      searchResults: searchResults.data || []
    };

  } catch (error) {
    console.error('❌ Material library example failed:', error);
    throw error;
  }
}

/**
 * Example 5: Batch operations
 */
export async function batchOperationsExample() {
  console.log('⚡ Demonstrating batch operations...');

  try {
    // Create multiple projects at once
    const projectNames = [
      'Kitchen Renovation',
      'Bathroom Remodel',
      'Home Office Setup'
    ];

    const projects = [];
    for (const name of projectNames) {
      const project = await executeCommand(
        'create_project',
        {
          name,
          description: `${name} project created via batch operation`,
          status: 'planning',
          priority: 'medium'
        },
        exampleUser
      );

      if (project.success) {
        projects.push(project.data);
        console.log(`✅ Created project: ${name}`);
      }
    }

    // Update all projects to in_progress status
    for (const project of projects) {
      await executeCommand(
        'update_project_status',
        {
          id: project.id,
          status: 'in_progress'
        },
        exampleUser
      );
    }

    console.log(`🔄 Updated ${projects.length} projects to in_progress status`);

    return projects;

  } catch (error) {
    console.error('❌ Batch operations example failed:', error);
    throw error;
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running Sylo-core usage examples...\n');

  try {
    // Example 1: Create project workflow
    const workflow = await createProjectWorkflow();
    console.log('');

    // Example 2: Project management
    await projectManagementExample();
    console.log('');

    // Example 3: Task board operations
    if (workflow.project) {
      await taskBoardExample(workflow.project.id);
      console.log('');
    }

    // Example 4: Material library
    await materialLibraryExample();
    console.log('');

    // Example 5: Batch operations
    await batchOperationsExample();
    console.log('');

    console.log('🎉 All examples completed successfully!');

  } catch (error) {
    console.error('❌ Examples failed:', error);
  }
}

// Export individual examples
export default {
  createProjectWorkflow,
  projectManagementExample,
  taskBoardExample,
  materialLibraryExample,
  batchOperationsExample,
  runAllExamples
};
