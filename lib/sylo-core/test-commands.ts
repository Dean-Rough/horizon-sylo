/**
 * Test script for Sylo-core commands
 * This file can be used to test command execution during development
 */

import { executeCommand, getSyloCoreStatus, getAvailableCommands } from './index';

// Mock user for testing
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  role: 'admin'
};

/**
 * Test basic system functionality
 */
export async function testSystemHealth() {
  console.log('🔍 Testing Sylo-core system health...');
  
  try {
    const status = await getSyloCoreStatus();
    console.log('✅ System Status:', status.status);
    console.log('📊 Details:', status.details);
    return true;
  } catch (error) {
    console.error('❌ System health check failed:', error);
    return false;
  }
}

/**
 * Test command availability
 */
export async function testAvailableCommands() {
  console.log('🔍 Testing available commands...');
  
  try {
    const commands = await getAvailableCommands(testUser);
    const commandCount = Object.keys(commands).length;
    console.log(`✅ Found ${commandCount} available commands`);
    
    // Log command categories
    const categories = ['project', 'task', 'material'];
    categories.forEach(category => {
      const categoryCommands = Object.values(commands).filter(
        (cmd: any) => cmd.category === category
      );
      console.log(`   📁 ${category}: ${categoryCommands.length} commands`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Available commands test failed:', error);
    return false;
  }
}

/**
 * Test project commands
 */
export async function testProjectCommands() {
  console.log('🔍 Testing project commands...');
  
  try {
    // Test create project
    const createResult = await executeCommand(
      'create_project',
      {
        name: 'Test Project',
        description: 'A test project for Sylo-core',
        status: 'planning',
        priority: 'medium'
      },
      testUser
    );
    
    if (!createResult.success) {
      throw new Error(`Create project failed: ${createResult.error?.message}`);
    }
    
    console.log('✅ Create project successful');
    const projectId = createResult.data.id;
    
    // Test list projects
    const listResult = await executeCommand(
      'list_projects',
      { limit: 5 },
      testUser
    );
    
    if (!listResult.success) {
      throw new Error(`List projects failed: ${listResult.error?.message}`);
    }
    
    console.log(`✅ List projects successful (${listResult.data.data.length} projects)`);
    
    // Test get project
    const getResult = await executeCommand(
      'get_project',
      { id: projectId },
      testUser
    );
    
    if (!getResult.success) {
      throw new Error(`Get project failed: ${getResult.error?.message}`);
    }
    
    console.log('✅ Get project successful');
    
    return { success: true, projectId };
  } catch (error) {
    console.error('❌ Project commands test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test task commands
 */
export async function testTaskCommands(projectId: string) {
  console.log('🔍 Testing task commands...');
  
  try {
    // Test create task
    const createResult = await executeCommand(
      'create_task',
      {
        title: 'Test Task',
        description: 'A test task for Sylo-core',
        project_id: projectId,
        status: 'todo',
        priority: 'medium'
      },
      testUser
    );
    
    if (!createResult.success) {
      throw new Error(`Create task failed: ${createResult.error?.message}`);
    }
    
    console.log('✅ Create task successful');
    const taskId = createResult.data.id;
    
    // Test list tasks
    const listResult = await executeCommand(
      'list_tasks',
      { project_id: projectId },
      testUser
    );
    
    if (!listResult.success) {
      throw new Error(`List tasks failed: ${listResult.error?.message}`);
    }
    
    console.log(`✅ List tasks successful (${listResult.data.length} tasks)`);
    
    // Test update task status
    const updateResult = await executeCommand(
      'update_task_status',
      { id: taskId, status: 'in_progress' },
      testUser
    );
    
    if (!updateResult.success) {
      throw new Error(`Update task status failed: ${updateResult.error?.message}`);
    }
    
    console.log('✅ Update task status successful');
    
    return { success: true, taskId };
  } catch (error) {
    console.error('❌ Task commands test failed:', error);
    return { success: false, error };
  }
}

/**
 * Test material commands
 */
export async function testMaterialCommands() {
  console.log('🔍 Testing material commands...');
  
  try {
    // Test add material
    const createResult = await executeCommand(
      'add_material',
      {
        name: 'Test Material',
        description: 'A test material for Sylo-core',
        category: 'flooring',
        supplier: 'Test Supplier',
        unit_cost: 25.99,
        unit_type: 'sqft',
        sustainability_rating: 8
      },
      testUser
    );
    
    if (!createResult.success) {
      throw new Error(`Add material failed: ${createResult.error?.message}`);
    }
    
    console.log('✅ Add material successful');
    const materialId = createResult.data.id;
    
    // Test search materials
    const searchResult = await executeCommand(
      'search_materials',
      { query: 'Test' },
      testUser
    );
    
    if (!searchResult.success) {
      throw new Error(`Search materials failed: ${searchResult.error?.message}`);
    }
    
    console.log(`✅ Search materials successful (${searchResult.data.length} materials)`);
    
    // Test get material categories
    const categoriesResult = await executeCommand(
      'get_material_categories',
      {},
      testUser
    );
    
    if (!categoriesResult.success) {
      throw new Error(`Get categories failed: ${categoriesResult.error?.message}`);
    }
    
    console.log(`✅ Get categories successful (${categoriesResult.data.length} categories)`);
    
    return { success: true, materialId };
  } catch (error) {
    console.error('❌ Material commands test failed:', error);
    return { success: false, error };
  }
}

/**
 * Run comprehensive test suite
 */
export async function runTestSuite() {
  console.log('🚀 Starting Sylo-core test suite...\n');
  
  const results = {
    systemHealth: false,
    availableCommands: false,
    projectCommands: false,
    taskCommands: false,
    materialCommands: false
  };
  
  // Test system health
  results.systemHealth = await testSystemHealth();
  console.log('');
  
  // Test available commands
  results.availableCommands = await testAvailableCommands();
  console.log('');
  
  // Test project commands
  const projectTest = await testProjectCommands();
  results.projectCommands = projectTest.success;
  console.log('');
  
  // Test task commands (if project creation succeeded)
  if (projectTest.success && projectTest.projectId) {
    const taskTest = await testTaskCommands(projectTest.projectId);
    results.taskCommands = taskTest.success;
    console.log('');
  }
  
  // Test material commands
  const materialTest = await testMaterialCommands();
  results.materialCommands = materialTest.success;
  console.log('');
  
  // Summary
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log('📋 Test Results Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log('');
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Sylo-core is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Export for use in other files
export default {
  testSystemHealth,
  testAvailableCommands,
  testProjectCommands,
  testTaskCommands,
  testMaterialCommands,
  runTestSuite
};
