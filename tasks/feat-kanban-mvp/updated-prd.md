# Kanban To-Do MVP PRD

## Overview
Build a web-based Kanban to-do MVP using Supabase (cloud) with email+password and OAuth (Google/Microsoft) auth. Users can create multiple boards, define custom columns, and manage hierarchical items (parent-child tree) with unlimited depth. Items have tags, priority, due date, and per-item status (mapped to columns). Collaboration, offline, attachments, comments, notes, and lateral dependencies are out of scope for MVP.

## Goals
- Web MVP with Supabase auth (email+password + OAuth Google/Microsoft).
- Multiple boards per user.
- Customizable columns per board with default Pendente / Em progresso / Concluido.
- Kanban UI with drag-and-drop ordering persisted.
- Hierarchical items (parent_id), unlimited depth, expand/collapse UI.
- Tags per board, filters (tag/status/priority/due date) and quick sorts (created, due, priority, alphabetical).
- Cascade delete (removing parent removes all descendants).

## Non-Goals (Future)
- Collaboration/sharing.
- Offline mode.
- Checklist, attachments, comments, notes.
- Lateral dependency blockers (non-parent).
- Desktop/mobile apps.

## Users and Access
- Single user per board (owner only).
- Auth via Supabase (email+password + OAuth Google/Microsoft).

## Core Data Model
Entities (Supabase tables):
- boards: id, owner_id, name, description, created_at.
- board_columns: id, board_id, name, order_index, created_at.
- items: id, board_id, column_id, parent_id, type_id (optional), title, description (optional), status (text), priority (low/medium/high), due_date (optional), created_at, completed_at (optional), order_index.
- tags: id, board_id, name, color (optional), created_at.
- item_tags: item_id, tag_id.
- item_types: id, board_id, name, created_at (custom values per board).

Notes:
- status is stored as column name text for quick filters but is driven by column association.
- order_index supports manual drag-and-drop ordering in a column.
- parent_id allows unlimited depth tree.

## UX Requirements
- Default board has three columns: Pendente / Em progresso / Concluido.
- Kanban view is primary.
- Each card shows title, priority, due date, tags, and collapse/expand children.
- Moving a parent card does not move children; each item has independent status/column.
- Filters (tag, status, priority, due date) and quick sorts (created, due, priority, alphabetical) are non-persisted.

## Error Handling
- Auth errors are visible and actionable.
- Empty states for no boards, no items, and filtered results.

## Success Criteria
- User can sign up/login (email+password or OAuth), create boards, manage columns, add items with hierarchy, move items between columns, and filter/sort.
