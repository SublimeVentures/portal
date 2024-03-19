import json
import sys

# Inputs from command line arguments
task_definition_file = sys.argv[1]
image_uri = sys.argv[2]
tenant_name = sys.argv[3]
env = sys.argv[4]
app = sys.argv[5]

# Load the existing task definition JSON
with open(task_definition_file) as f:
    task_def = json.load(f)

# Update fields based on the input
task_def['containerDefinitions'][0]['name'] = f"{tenant_name}-{env}-{app}"
task_def['containerDefinitions'][0]['image'] = image_uri
task_def['containerDefinitions'][0]['dockerLabels']['app'] = app
task_def['containerDefinitions'][0]['dockerLabels']['environment'] = env
task_def['containerDefinitions'][0]['dockerLabels']['project'] = tenant_name
task_def['containerDefinitions'][0]['logConfiguration']['options']['awslogs-group'] = f"/ecs/{tenant_name}-{env}-{app}"
task_def['family'] = f"{tenant_name}-{env}-{app}-td"

# Assuming tags is a list of dictionaries like [{"key": "project", "value": "value1"}, {"key": "environment", "value": "value2"}]
for tag in task_def['tags']:
    if tag['key'] == 'project':
        tag['value'] = tenant_name
    elif tag['key'] == 'environment':
        tag['value'] = env
    elif tag['key'] == 'app':
        tag['value'] = app

# Define the output file path
output_file_path = f".github/scripts/{tenant_name}-development-task-definition.json"

# Write the updated task definition back to the new file
with open(output_file_path, 'w') as f:
    json.dump(task_def, f, indent=2)

print(f"Updated task definition written to {output_file_path}")

