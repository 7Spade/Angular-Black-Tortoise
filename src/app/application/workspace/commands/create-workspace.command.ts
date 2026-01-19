import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { Workspace } from '@domain/workspace/entities/workspace.entity';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { WorkspaceOwner } from '@domain/workspace/value-objects/workspace-owner.value-object';
import { WorkspaceQuota } from '@domain/workspace/value-objects/workspace-quota.value-object';
import { WorkspaceStatus } from '@domain/workspace/value-objects/workspace-status.value-object';
import { DisplayName } from '@domain/identity/value-objects/display-name.value-object';
import { Timestamp } from '@domain/shared/value-objects/timestamp.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';

/**
 * CreateWorkspaceCommand - Command to create a new workspace
 */
export interface CreateWorkspaceCommand {
  ownerType: 'user' | 'organization';
  ownerId: string;
  name: string;
  maxModules?: number;
  maxStorage?: number;
}

/**
 * CreateWorkspaceCommandHandler - Handler for creating a new workspace
 */
@Injectable({ providedIn: 'root' })
export class CreateWorkspaceCommandHandler {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(
    command: CreateWorkspaceCommand
  ): Promise<Result<string, DomainError>> {
    try {
      // Validate workspace name
      const nameResult = DisplayName.create(command.name);
      if (!nameResult.isOk) {
        return Result.fail(nameResult.error);
      }

      // Create workspace owner
      const ownerResult = WorkspaceOwner.create(
        command.ownerId,
        command.ownerType
      );
      if (!ownerResult.isOk) {
        return Result.fail(ownerResult.error);
      }

      // Create workspace quota
      const quotaResult = WorkspaceQuota.create({
        maxModules: command.maxModules ?? 10,
        maxStorage: command.maxStorage ?? 1073741824, // 1GB default
      });
      if (!quotaResult.isOk) {
        return Result.fail(quotaResult.error);
      }

      // Create workspace status
      const statusResult = WorkspaceStatus.create('active');
      if (!statusResult.isOk) {
        return Result.fail(statusResult.error);
      }

      // Create workspace entity
      const workspaceIdResult = WorkspaceId.create(crypto.randomUUID());
      if (!workspaceIdResult.isOk) {
        return Result.fail(workspaceIdResult.error);
      }

      const workspace = Workspace.create({
        id: workspaceIdResult.value,
        owner: ownerResult.value,
        name: nameResult.value,
        status: statusResult.value,
        quota: quotaResult.value,
        moduleIds: [],
        createdAt: Timestamp.now(),
      });

      // Save workspace
      await this.repository.save?.(workspace);

      return Result.ok(workspaceIdResult.value.getValue());
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : 'Failed to create workspace'
        )
      );
    }
  }
}
