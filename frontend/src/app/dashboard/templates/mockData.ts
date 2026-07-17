export interface VariableSpec {
  name: string;
  type: "Text" | "Dropdown" | "Number";
  required: boolean;
  defaultValue: string;
  placeholder?: string;
  description?: string;
  options?: string[];
}

export type StepType =
  | "Information"
  | "Warning"
  | "Command"
  | "Verification"
  | "Checklist"
  | "Input"
  | "Code Block"
  | "Notes";

export interface StepSpec {
  id: string;
  type: StepType;
  name: string;
  content: string;
  command?: string;
  code?: string;
  checklistItems?: string[];
  warningText?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  variables: string[]; // Keep for compatibility
  steps: string[]; // Keep for compatibility
  variablesSpec: VariableSpec[];
  stepsSpec: StepSpec[];
  lastUsed: string;
  lastUsedTimestamp: number;
  createdTimestamp: number;
  timesUsed: number;
  isFavorite: boolean;
  version: number;
}

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Deploy Website",
    description: "Automated production deployment workflow for static websites and SPAs.",
    category: "DevOps",
    difficulty: "Easy",
    estimatedTime: "10 mins",
    variables: ["repo_url", "branch_name", "build_command"],
    steps: [
      "Pull latest main branch",
      "Run npm install",
      "Run npm run build",
      "Run audit tests",
      "Copy build output to static folder",
      "Reload reverse proxy"
    ],
    variablesSpec: [
      {
        name: "repo_url",
        type: "Text",
        required: true,
        defaultValue: "https://github.com/org/website",
        placeholder: "Git URL",
        description: "Source code repository target"
      },
      {
        name: "branch_name",
        type: "Dropdown",
        required: true,
        defaultValue: "main",
        options: ["main", "master", "staging", "dev"],
        description: "Branch to pull"
      },
      {
        name: "build_command",
        type: "Text",
        required: true,
        defaultValue: "npm run build",
        description: "Command to build target static assets"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Pull latest branch",
        content: "Fetches upstream commits and checkouts repository branch: `{{branch_name}}`",
        command: "git clone {{repo_url}} && cd website && git checkout {{branch_name}}"
      },
      {
        id: "s2",
        type: "Command",
        name: "Install dependencies",
        content: "Runs clean package installations.",
        command: "npm ci --legacy-peer-deps"
      },
      {
        id: "s3",
        type: "Command",
        name: "Build assets",
        content: "Builds compile production static assets.",
        command: "{{build_command}}"
      },
      {
        id: "s4",
        type: "Verification",
        name: "Validate build",
        content: "Verifies that index file is present in the build directory."
      },
      {
        id: "s5",
        type: "Warning",
        name: "Prune Target Directory",
        content: "Target deployment static folders must be emptied.",
        warningText: "Double-check path variable before executing deletion script."
      },
      {
        id: "s6",
        type: "Command",
        name: "Copy files & reload",
        content: "Deploys to webroot and restarts services.",
        command: "cp -R dist/* /var/www/html/ && systemctl reload nginx"
      }
    ],
    lastUsed: "2 hours ago",
    lastUsedTimestamp: Date.now() - 2 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    timesUsed: 124,
    isFavorite: true,
    version: 1
  },
  {
    id: "2",
    name: "Redis Cache Recovery",
    description: "Evict keys, reset connection pools, and clear high-latency queues in Redis.",
    category: "Database",
    difficulty: "Hard",
    estimatedTime: "15 mins",
    variables: ["redis_host", "redis_port", "max_memory_limit", "eviction_policy"],
    steps: [
      "Verify CPU and memory usage",
      "Check connection counts",
      "Switch eviction policy to allkeys-lru",
      "Kill client connections",
      "Check log files for slow logs",
      "Scale Redis cluster nodes",
      "Test connection latency",
      "Notify system health monitors"
    ],
    variablesSpec: [
      {
        name: "redis_host",
        type: "Text",
        required: true,
        defaultValue: "redis-prod.internal.net",
        description: "Target Redis hostname"
      },
      {
        name: "redis_port",
        type: "Number",
        required: true,
        defaultValue: "6379",
        description: "Target Redis port"
      },
      {
        name: "max_memory_limit",
        type: "Text",
        required: true,
        defaultValue: "8gb",
        description: "Memory threshold"
      },
      {
        name: "eviction_policy",
        type: "Dropdown",
        required: true,
        defaultValue: "allkeys-lru",
        options: ["allkeys-lru", "volatile-lru", "noeviction"],
        description: "Key eviction strategy"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Verify Memory usage",
        content: "Queries client stats and active memory usage on `{{redis_host}}:{{redis_port}}`.",
        command: "redis-cli -h {{redis_host}} -p {{redis_port}} INFO | grep -E \"connected_clients|used_memory|maxmemory\""
      },
      {
        id: "s2",
        type: "Warning",
        name: "Eviction Limit Check",
        content: "If memory equals max limit and eviction policy is set to noeviction, all new writes will crash.",
        warningText: "Applying immediate policy update below prevents connection crashes."
      },
      {
        id: "s3",
        type: "Command",
        name: "Switch eviction strategy",
        content: "Configures memory eviction policy dynamically.",
        command: "redis-cli -h {{redis_host}} -p {{redis_port}} config set maxmemory-policy {{eviction_policy}}"
      },
      {
        id: "s4",
        type: "Command",
        name: "Kill idle connections",
        content: "Cleans old client sockets and recovers client pool capacity.",
        command: "redis-cli -h {{redis_host}} -p {{redis_port}} CLIENT KILL TYPE normal"
      },
      {
        id: "s5",
        type: "Verification",
        name: "Validate connection drops",
        content: "Confirm connection socket load count has dropped to standard baseline limits."
      }
    ],
    lastUsed: "Yesterday",
    lastUsedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 40 * 24 * 60 * 60 * 1000,
    timesUsed: 48,
    isFavorite: false,
    version: 2
  },
  {
    id: "3",
    name: "PostgreSQL Database Rollback",
    description: "Revert migration schema and restore standard postgres tables to the last stable transaction checkpoint.",
    category: "Database",
    difficulty: "Hard",
    estimatedTime: "20 mins",
    variables: ["db_host", "db_name", "db_user", "target_version", "backup_file"],
    steps: [
      "Connect to db instance",
      "Check active transactions count",
      "Kill running queries",
      "Restore schema rollback from backup",
      "Run post-schema integrity tests",
      "Verify system endpoints health"
    ],
    variablesSpec: [
      {
        name: "db_host",
        type: "Text",
        required: true,
        defaultValue: "pg-prod.internal.net",
        description: "Postgres host"
      },
      {
        name: "db_name",
        type: "Text",
        required: true,
        defaultValue: "core_prod",
        description: "DB schema name"
      },
      {
        name: "db_user",
        type: "Text",
        required: true,
        defaultValue: "postgres",
        description: "User username"
      },
      {
        name: "backup_file",
        type: "Text",
        required: true,
        defaultValue: "backup_latest.sql",
        description: "SQL file source"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Check Active Queries",
        content: "Query active running connections blocking transaction migrations on `{{db_name}}`.",
        command: "psql -h {{db_host}} -U {{db_user}} -d {{db_name}} -c \"SELECT pid, age(query_start), query FROM pg_stat_activity WHERE state != 'idle';\""
      },
      {
        id: "s2",
        type: "Warning",
        name: "Schema Deletion Warning",
        content: "Executing rollback changes table schemas. Ensure snapshots exist.",
        warningText: "Restoring from: {{backup_file}}"
      },
      {
        id: "s3",
        type: "Command",
        name: "Execute rollback SQL",
        content: "Pipes sql schema back to database instance.",
        command: "psql -h {{db_host}} -U {{db_user}} -d {{db_name}} -f {{backup_file}}"
      },
      {
        id: "s4",
        type: "Verification",
        name: "Integrity Checks",
        content: "Verifies application migrations and checks schema state."
      }
    ],
    lastUsed: "3 days ago",
    lastUsedTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
    timesUsed: 14,
    isFavorite: false,
    version: 1
  },
  {
    id: "4",
    name: "Kubernetes CrashLoopBackOff Resolution",
    description: "Inspect crashlogs, trace container exit code 137 (OOM), and patch spec deployment settings.",
    category: "Kubernetes",
    difficulty: "Medium",
    estimatedTime: "12 mins",
    variables: ["namespace", "deployment_name", "container_name", "new_memory_limit"],
    steps: [
      "Describe pod specs and events",
      "Check container logs",
      "Verify Exit Code 137",
      "Patch deployment spec to increase memory limit",
      "Wait for rollout to finish",
      "Verify memory usage stability"
    ],
    variablesSpec: [
      {
        name: "namespace",
        type: "Text",
        required: true,
        defaultValue: "prod-eu",
        description: "Target Kubernetes namespace"
      },
      {
        name: "deployment_name",
        type: "Text",
        required: true,
        defaultValue: "payment-service",
        description: "Name of target deployment"
      },
      {
        name: "container_name",
        type: "Text",
        required: true,
        defaultValue: "payment-service",
        description: "Target container"
      },
      {
        name: "new_memory_limit",
        type: "Text",
        required: true,
        defaultValue: "1Gi",
        description: "Allocated RAM"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Check Pod Details",
        content: "Prints resource usage statistics and status logs for `{{deployment_name}}` in namespace `{{namespace}}`.",
        command: "kubectl describe deployment/{{deployment_name}} -n {{namespace}}"
      },
      {
        id: "s2",
        type: "Warning",
        name: "Ensure OOM Exit Code",
        content: "Confirm that pod termination reason is indeed OOMKilled (Exit Code 137). Do not raise limit otherwise.",
        warningText: "If exit code is 1, check application runtime configuration instead."
      },
      {
        id: "s3",
        type: "Command",
        name: "Patch memory limits",
        content: "Applies kubernetes patch spec dynamically.",
        command: "kubectl patch deployment {{deployment_name}} -n {{namespace}} --patch '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"{{container_name}}\",\"resources\":{\"limits\":{\"memory\":\"{{new_memory_limit}}\"}}}]}}}}'"
      },
      {
        id: "s4",
        type: "Verification",
        name: "Rollout Verification",
        content: "Verifies deployment rollout completes within timeout parameters.",
        command: "kubectl rollout status deployment/{{deployment_name}} -n {{namespace}} --timeout=60s"
      }
    ],
    lastUsed: "4 hours ago",
    lastUsedTimestamp: Date.now() - 4 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    timesUsed: 92,
    isFavorite: true,
    version: 1
  },
  {
    id: "5",
    name: "Docker Container Startup Failure",
    description: "Trace missing build artifacts inside multistage docker builds and rebuild cached layers.",
    category: "Docker",
    difficulty: "Medium",
    estimatedTime: "8 mins",
    variables: ["image_name", "image_tag", "registry_url"],
    steps: [
      "Inspect docker container error logs",
      "Analyze Dockerfile build stage structure",
      "Add COPY commands for compiled files",
      "Build Docker image locally",
      "Push Docker image to registry"
    ],
    variablesSpec: [
      {
        name: "image_name",
        type: "Text",
        required: true,
        defaultValue: "frontend-app",
        description: "Local target Docker tag"
      },
      {
        name: "image_tag",
        type: "Text",
        required: true,
        defaultValue: "v2.1.1",
        description: "Version target"
      },
      {
        name: "registry_url",
        type: "Text",
        required: true,
        defaultValue: "registry.company.com",
        description: "Image repository"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Inspect Container failure",
        content: "Dumps stdout/stderr logs of crashing container.",
        command: "docker logs {{image_name}}-container"
      },
      {
        id: "s2",
        type: "Checklist",
        name: "Validate Dockerfile instructions",
        content: "Verify dependencies configurations:",
        checklistItems: [
          "Check that builder stage compiles assets (e.g. dist folder)",
          "Verify runner stage copies compiler artifacts from builder",
          "Ensure production dependencies are installed in runner stage"
        ]
      },
      {
        id: "s3",
        type: "Command",
        name: "Build and push image",
        content: "Builds a fresh version and uploads tag to `{{registry_url}}`.",
        command: "docker build -t {{registry_url}}/web/{{image_name}}:{{image_tag}} . && docker push {{registry_url}}/web/{{image_name}}:{{image_tag}}"
      }
    ],
    lastUsed: "Last week",
    lastUsedTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
    timesUsed: 37,
    isFavorite: false,
    version: 1
  },
  {
    id: "6",
    name: "AWS S3 Glacier Archival Backup",
    description: "Automated AWS lifecycle transition and cold storage database archival backups.",
    category: "AWS",
    difficulty: "Easy",
    estimatedTime: "5 mins",
    variables: ["source_snapshot_id", "s3_bucket_name", "glacier_transition_days"],
    steps: [
      "Locate database snapshots",
      "Upload snapshots to S3 archive bucket",
      "Verify upload checksums",
      "Apply lifecycle transition rules to Glacier"
    ],
    variablesSpec: [
      {
        name: "s3_bucket_name",
        type: "Text",
        required: true,
        defaultValue: "company-backups-archive",
        description: "Target S3 bucket"
      },
      {
        name: "source_snapshot_id",
        type: "Text",
        required: true,
        defaultValue: "rds-db-snapshot-01",
        description: "RDS snapshot UUID"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Check snapshot state",
        content: "Validates AWS database snap status.",
        command: "aws rds describe-db-snapshots --db-snapshot-identifier {{source_snapshot_id}}"
      },
      {
        id: "s2",
        type: "Command",
        name: "Initiate upload",
        content: "Copy backup snapshots to S3 bucket `{{s3_bucket_name}}`.",
        command: "aws s3 cp s3://db-backups/{{source_snapshot_id}}.tar.gz s3://{{s3_bucket_name}}/"
      }
    ],
    lastUsed: "3 hours ago",
    lastUsedTimestamp: Date.now() - 3 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 50 * 24 * 60 * 60 * 1000,
    timesUsed: 341,
    isFavorite: false,
    version: 1
  },
  {
    id: "7",
    name: "NGINX SSL/TLS Certificate Rotation",
    description: "Renew Let's Encrypt certificates, verify NGINX config file syntax, and reload service daemon.",
    category: "Linux",
    difficulty: "Easy",
    estimatedTime: "6 mins",
    variables: ["domain_name", "config_file_path", "certbot_flags"],
    steps: [
      "Run certbot renewal command",
      "Check active SSL certificate validity",
      "Verify NGINX configuration syntax",
      "Reload systemd nginx service",
      "Check client SSL handshake response"
    ],
    variablesSpec: [
      {
        name: "domain_name",
        type: "Text",
        required: true,
        defaultValue: "api.company.com",
        description: "SSL domain host"
      },
      {
        name: "config_file_path",
        type: "Text",
        required: true,
        defaultValue: "/etc/nginx/nginx.conf",
        description: "Path configuration"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Run certbot",
        content: "Renews certificates for `{{domain_name}}`.",
        command: "certbot renew --cert-name {{domain_name}}"
      },
      {
        id: "s2",
        type: "Command",
        name: "Test Nginx",
        content: "Verifies configuration at `{{config_file_path}}`.",
        command: "nginx -t -c {{config_file_path}}"
      },
      {
        id: "s3",
        type: "Command",
        name: "Reload Nginx service",
        content: "Reload nginx process daemon.",
        command: "systemctl reload nginx"
      }
    ],
    lastUsed: "Yesterday",
    lastUsedTimestamp: Date.now() - 18 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
    timesUsed: 82,
    isFavorite: false,
    version: 1
  },
  {
    id: "8",
    name: "Payment API Gateway Timeout Fix",
    description: "Troubleshoot network drops and rate limiting issues on Payment API gateway routes.",
    category: "Networking",
    difficulty: "Hard",
    estimatedTime: "18 mins",
    variables: ["payment_gateway_url", "proxy_address", "timeout_limit", "retry_attempts"],
    steps: [
      "Check external API response codes",
      "Inspect gateway firewall traffic blocks",
      "Check client-side payload sizes",
      "Verify proxy rewrite routing rules",
      "Test outbound network connections"
    ],
    variablesSpec: [
      {
        name: "payment_gateway_url",
        type: "Text",
        required: true,
        defaultValue: "https://api.payment-service.com",
        description: "Base API route URL"
      },
      {
        name: "timeout_limit",
        type: "Number",
        required: true,
        defaultValue: "30",
        description: "Timeout gateway max limit"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Probe health connection",
        content: "Runs request connection latency checks to `{{payment_gateway_url}}`.",
        command: "curl -Iv --max-time {{timeout_limit}} {{payment_gateway_url}}/health"
      },
      {
        id: "s2",
        type: "Verification",
        name: "Verify connectivity logs",
        content: "Confirm connection does not exit with gateway socket timeouts."
      }
    ],
    lastUsed: "Yesterday",
    lastUsedTimestamp: Date.now() - 22 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
    timesUsed: 61,
    isFavorite: false,
    version: 1
  },
  {
    id: "9",
    name: "GitHub Actions Workflow Deploy",
    description: "Troubleshoot failed GitHub Actions runner runs, cache clears, and credentials setup.",
    category: "DevOps",
    difficulty: "Medium",
    estimatedTime: "11 mins",
    variables: ["repo_name", "workflow_id", "runner_label"],
    steps: [
      "Inspect GitHub Actions logs",
      "Clear runner build cache",
      "Check action secrets setup",
      "Re-run build jobs",
      "Validate target container state"
    ],
    variablesSpec: [
      {
        name: "repo_name",
        type: "Text",
        required: true,
        defaultValue: "contextsop",
        description: "GitHub target repository"
      },
      {
        name: "workflow_id",
        type: "Text",
        required: true,
        defaultValue: "deploy.yml",
        description: "Workflow YAML file"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Inspect workflow status",
        content: "Queries GitHub API for latest runs.",
        command: "gh run list --repo {{repo_name}} --workflow {{workflow_id}} --limit 5"
      },
      {
        id: "s2",
        type: "Command",
        name: "Trigger workflow rerun",
        content: "Starts a new run with clean cache variables.",
        command: "gh run rerun latest --repo {{repo_name}}"
      }
    ],
    lastUsed: "5 mins ago",
    lastUsedTimestamp: Date.now() - 5 * 60 * 1000,
    createdTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    timesUsed: 521,
    isFavorite: true,
    version: 1
  },
  {
    id: "10",
    name: "Linux Server Out of Disk Space Cleanup",
    description: "Find large files, clear journald system logs, and optimize inodes capacity on root partition.",
    category: "Linux",
    difficulty: "Medium",
    estimatedTime: "10 mins",
    variables: ["target_directory", "max_log_size", "prune_docker_cache"],
    steps: [
      "Scan filesystem for large folders",
      "Prune docker dangling images and cache",
      "Truncate logs under journald directory",
      "Clean package manager dependencies",
      "Verify disk block usage"
    ],
    variablesSpec: [
      {
        name: "target_directory",
        type: "Text",
        required: true,
        defaultValue: "/var/log",
        description: "Target search path"
      },
      {
        name: "max_log_size",
        type: "Text",
        required: true,
        defaultValue: "100M",
        description: "Journal logs limit"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Scan disk space usage",
        content: "Identifies directories taking up excessive size.",
        command: "du -sh {{target_directory}}/* | sort -rh | head -n 10"
      },
      {
        id: "s2",
        type: "Command",
        name: "Prune Journal logs",
        content: "Prunes system journald logs down to size `{{max_log_size}}`.",
        command: "journalctl --vacuum-size={{max_log_size}}"
      },
      {
        id: "s3",
        type: "Command",
        name: "Clean Docker builder caches",
        content: "Cleans cached container layers.",
        command: "docker system prune -a --volumes -f"
      },
      {
        id: "s4",
        type: "Verification",
        name: "Verify disk free spacing",
        content: "Confirm disk partition holds at least 15% free volume capacity.",
        command: "df -h /"
      }
    ],
    lastUsed: "2 days ago",
    lastUsedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
    timesUsed: 110,
    isFavorite: false,
    version: 1
  },
  {
    id: "11",
    name: "Datadog High Latency Alert Fix",
    description: "Trace latency spikes, debug thread pools exhaustion, and increase worker process count.",
    category: "Monitoring",
    difficulty: "Medium",
    estimatedTime: "14 mins",
    variables: ["datadog_api_key", "application_name", "max_worker_processes"],
    steps: [
      "Check Datadog APM tracing dashboard",
      "Identify high-latency queries",
      "Examine application thread pool status",
      "Adjust server process worker count",
      "Restart application daemon",
      "Confirm latency metrics stabilization"
    ],
    variablesSpec: [
      {
        name: "application_name",
        type: "Text",
        required: true,
        defaultValue: "payment-api",
        description: "Application key identifier"
      },
      {
        name: "max_worker_processes",
        type: "Number",
        required: true,
        defaultValue: "8",
        description: "Target service process count"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Update worker counts",
        content: "Configures and starts worker limits in application config settings.",
        command: "sed -i 's/workers = .*/workers = {{max_worker_processes}}/g' /etc/{{application_name}}/config.ini"
      },
      {
        id: "s2",
        type: "Command",
        name: "Restart daemon services",
        content: "Reloads application configs.",
        command: "systemctl restart {{application_name}}"
      }
    ],
    lastUsed: "4 hours ago",
    lastUsedTimestamp: Date.now() - 4.5 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
    timesUsed: 89,
    isFavorite: false,
    version: 1
  },
  {
    id: "12",
    name: "API Version Rollback Workflow",
    description: "Instantly rollback API microservice image version in production environment.",
    category: "DevOps",
    difficulty: "Medium",
    estimatedTime: "8 mins",
    variables: ["service_name", "rollback_version", "notification_channel"],
    steps: [
      "Identify running container image versions",
      "Update configuration to previous stable version",
      "Restart container deployment",
      "Verify API endpoints response codes",
      "Notify devops alert channel"
    ],
    variablesSpec: [
      {
        name: "service_name",
        type: "Text",
        required: true,
        defaultValue: "payment-api",
        description: "Target microservice key"
      },
      {
        name: "rollback_version",
        type: "Text",
        required: true,
        defaultValue: "v2.1.0",
        description: "Target version rollback image"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Update image targets",
        content: "Sets deployment container to roll version: `{{rollback_version}}`.",
        command: "kubectl set image deployment/{{service_name}} *=registry.company.com/{{service_name}}:{{rollback_version}} -n prod"
      },
      {
        id: "s2",
        type: "Verification",
        name: "Verify service health response",
        content: "Queries endpoints to ensure healthy rollouts completed."
      }
    ],
    lastUsed: "Yesterday",
    lastUsedTimestamp: Date.now() - 20 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    timesUsed: 43,
    isFavorite: false,
    version: 1
  },
  {
    id: "13",
    name: "Credential Leak Remediation",
    description: "Remediate leaked API keys or passwords, revoke credentials, and rotate auth tokens in database.",
    category: "Security",
    difficulty: "Hard",
    estimatedTime: "25 mins",
    variables: ["compromised_service", "vault_key_path", "secret_name", "target_env"],
    steps: [
      "Locate source of leaked credentials",
      "Revoke compromised tokens/keys",
      "Generate new secure API credentials",
      "Inject new credentials into production vault",
      "Restart active service pods",
      "Audit system access logs for anomalies"
    ],
    variablesSpec: [
      {
        name: "compromised_service",
        type: "Text",
        required: true,
        defaultValue: "github-actions-deployer",
        description: "Leaked credential label"
      },
      {
        name: "target_env",
        type: "Dropdown",
        required: true,
        defaultValue: "Production",
        options: ["Production", "Staging", "Development"],
        description: "Target environment"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Warning",
        name: "Compromise Alert",
        content: "Securing leaked credential for `{{compromised_service}}` under `{{target_env}}`.",
        warningText: "All API integrations using this key must be paused until token rotation is complete."
      },
      {
        id: "s2",
        type: "Command",
        name: "Revoke API access token",
        content: "Revokes token dynamically.",
        command: "vault token revoke -accessor {{compromised_service}}-accessor"
      }
    ],
    lastUsed: "Last month",
    lastUsedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    timesUsed: 12,
    isFavorite: false,
    version: 1
  },
  {
    id: "14",
    name: "Production Schema Migration",
    description: "Apply database schema changes, migrate data, and check constraints without downtime.",
    category: "Database",
    difficulty: "Hard",
    estimatedTime: "30 mins",
    variables: ["db_connection_string", "migration_version", "index_name", "dry_run_flag"],
    steps: [
      "Run database dry-run migration test",
      "Create database checkpoint backup",
      "Execute migration scripts",
      "Apply index updates concurrently",
      "Validate foreign key constraints",
      "Verify read/write query speeds"
    ],
    variablesSpec: [
      {
        name: "migration_version",
        type: "Text",
        required: true,
        defaultValue: "2026071701",
        description: "Target migration script"
      },
      {
        name: "index_name",
        type: "Text",
        required: true,
        defaultValue: "idx_payments_user_id",
        description: "Index to build"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Apply migration script",
        content: "Applies script version `{{migration_version}}`.",
        command: "python manage.py db upgrade --version {{migration_version}}"
      },
      {
        id: "s2",
        type: "Command",
        name: "Create Indexes concurrently",
        content: "Build database indexes asynchronously.",
        command: "psql -c \"CREATE INDEX CONCURRENTLY {{index_name}} ON payments(user_id);\""
      }
    ],
    lastUsed: "3 days ago",
    lastUsedTimestamp: Date.now() - 3.2 * 24 * 60 * 60 * 1000,
    createdTimestamp: Date.now() - 11 * 24 * 60 * 60 * 1000,
    timesUsed: 28,
    isFavorite: false,
    version: 1
  },
  {
    id: "15",
    name: "TCP/HTTP Service Health Check",
    description: "Perform network connectivity checks, parse JSON status payloads, and verify SSL handshakes.",
    category: "Monitoring",
    difficulty: "Easy",
    estimatedTime: "5 mins",
    variables: ["health_endpoint_url", "expected_status_code", "timeout_seconds"],
    steps: [
      "Perform ping test to remote host",
      "Check HTTP status code at health endpoint",
      "Verify SSL certificate expiration details",
      "Check JSON response payload format"
    ],
    variablesSpec: [
      {
        name: "health_endpoint_url",
        type: "Text",
        required: true,
        defaultValue: "https://api.company.com/health",
        description: "Target test URL route"
      },
      {
        name: "expected_status_code",
        type: "Number",
        required: true,
        defaultValue: "200",
        description: "Target success status"
      }
    ],
    stepsSpec: [
      {
        id: "s1",
        type: "Command",
        name: "Perform curl probe",
        content: "Queries endpoint `{{health_endpoint_url}}`.",
        command: "curl -Iv --fail --max-time 10 {{health_endpoint_url}}"
      },
      {
        id: "s2",
        type: "Verification",
        name: "Confirm status matches",
        content: "Ensure returned HTTP status equals expected value: `{{expected_status_code}}`."
      }
    ],
    lastUsed: "10 mins ago",
    lastUsedTimestamp: Date.now() - 10 * 60 * 1000,
    createdTimestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    timesUsed: 1202,
    isFavorite: false,
    version: 1
  }
];
