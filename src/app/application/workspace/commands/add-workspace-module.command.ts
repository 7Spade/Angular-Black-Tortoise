import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceAggregate } from '@domain/workspace/aggregates/workspace.aggregate';
import { WorkspaceModule } from '@domain/workspace/entities/workspace-module.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { ModuleKey } from '@domain/workspace/value-objects/module-key.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { NotFoundError } from '@domain/shared/errors/not-found.error';

/**
 * AddWorkspaceModuleCommand - Command to add a module to a workspace
 */
export interface AddWorkspaceModuleCommand {
  workspaceId: string;
  moduleKey: string;
  config?: Record<string, unknown>;
}

/**
 * AddWorkspaceModuleCommandHandler - Handler for adding a module to a workspace
 */
@Injectable({ providedIn: 'root' })
export class AddWorkspaceModuleCommandHandler {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(
    command: AddWorkspaceModuleCommand
  ): Promise<Result<string, DomainError>> {
    try {
      // Validate workspace ID
      const workspaceIdResult = WorkspaceId.fromString(command.workspaceId);
      if (!workspaceIdResult.isOk) {
        return Result.fail(workspaceIdResult.error);
      }

      // Validate module key
      const moduleKeyResult = ModuleKey.create(command.moduleKey);
      if (!moduleKeyResult.isOk) {
        return Result.fail(moduleKeyResult.error);
      }

      // Find workspace
      const workspace = await this.repository.findById?.(
        workspaceIdResult.value
      );

      if (!workspace) {
        return Result.fail(
          new NotFoundError(
            `Workspace with id ${command.workspaceId} not found`
          )
        );
      }

      // Find existing modules
      const modules = await this.repository.findModules?.(
        workspaceIdResult.value
      );

      // Create aggregate and validate quota
      const aggregate = WorkspaceAggregate.create({ workspace, modules });

      // Create new module
      const moduleId = `${command.workspaceId}_${command.moduleKey}`;
      const newModule = WorkspaceModule.create({
        id: moduleId,
        workspaceId: workspaceIdResult.value,
        moduleKey: moduleKeyResult.value,
        config: command.config ?? {},
      });

      // Add module to aggregate (validates quota limits)
      const addResult = aggregate.addModule(newModule);
      if (!addResult.isOk) {
        return Result.fail(addResult.error);
      }

      // Save module
      await this.repository.saveModule?.(newModule);

      // Update workspace with new module ID
      const updatedWorkspace = workspace.addModule(moduleId);
      const updateResult = updatedWorkspace;
      if (!updateResult.isOk) {
        return Result.fail(updateResult.error);
      }

      await this.repository.save?.(updateResult.value);

      return Result.ok(moduleId);
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error
            ? error.message
            : 'Failed to add workspace module'
        )
      );
    }
  }
}
