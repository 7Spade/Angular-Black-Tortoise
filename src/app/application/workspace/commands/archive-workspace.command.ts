import { Injectable, inject } from '@angular/core';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';
import { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import { Result } from '@domain/shared/types/result.type';
import { DomainError } from '@domain/shared/errors/domain.error';
import { NotFoundError } from '@domain/shared/errors/not-found.error';

/**
 * ArchiveWorkspaceCommand - Command to archive a workspace
 */
export interface ArchiveWorkspaceCommand {
  workspaceId: string;
}

/**
 * ArchiveWorkspaceCommandHandler - Handler for archiving a workspace
 */
@Injectable({ providedIn: 'root' })
export class ArchiveWorkspaceCommandHandler {
  private readonly repository = inject<WorkspaceRepository>(
    'WorkspaceRepository' as any
  );

  async execute(
    command: ArchiveWorkspaceCommand
  ): Promise<Result<void, DomainError>> {
    try {
      // Validate workspace ID
      const workspaceIdResult = WorkspaceId.fromString(command.workspaceId);
      if (!workspaceIdResult.isOk) {
        return Result.fail(workspaceIdResult.error);
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

      // Archive workspace
      const archiveResult = workspace.archive();
      if (!archiveResult.isOk) {
        return Result.fail(archiveResult.error);
      }

      // Save archived workspace
      await this.repository.save?.(archiveResult.value);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error
            ? error.message
            : 'Failed to archive workspace'
        )
      );
    }
  }
}
