/**
 * SessionCard Component Tests
 *
 * Tests for the session card component that displays session summaries.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SessionCard } from '../SessionCard';
import { SessionSummaryDTO, SessionStatus, Stage, StageStatus } from '@listen-well/shared';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Helper to create mock session
function createMockSession(overrides: Partial<SessionSummaryDTO> = {}): SessionSummaryDTO {
  return {
    id: 'session-1',
    relationshipId: 'rel-1',
    status: SessionStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    partner: {
      id: 'user-2',
      name: 'Jane Doe',
    },
    myProgress: {
      stage: Stage.WITNESS,
      status: StageStatus.IN_PROGRESS,
      startedAt: '2024-01-01T00:00:00Z',
      completedAt: null,
    },
    partnerProgress: {
      stage: Stage.WITNESS,
      status: StageStatus.IN_PROGRESS,
      startedAt: '2024-01-01T00:00:00Z',
      completedAt: null,
    },
    selfActionNeeded: [],
    partnerActionNeeded: [],
    ...overrides,
  };
}

describe('SessionCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders partner name', () => {
    const session = createMockSession({ partner: { id: 'user-2', name: 'John Smith' } });
    render(<SessionCard session={session} />);

    expect(screen.getByText('John Smith')).toBeTruthy();
  });

  it('renders fallback when partner has no name', () => {
    const session = createMockSession({ partner: { id: 'user-2', name: null } });
    render(<SessionCard session={session} />);

    expect(screen.getByText('Partner')).toBeTruthy();
  });

  it('renders current stage name', () => {
    const session = createMockSession({
      myProgress: {
        stage: Stage.WITNESS,
        status: StageStatus.IN_PROGRESS,
        startedAt: '2024-01-01T00:00:00Z',
        completedAt: null,
      },
    });
    render(<SessionCard session={session} />);

    expect(screen.getByText('The Witness')).toBeTruthy();
  });

  it('shows "Your turn" when action is needed from self', () => {
    const session = createMockSession({
      selfActionNeeded: ['complete_stage'],
    });
    render(<SessionCard session={session} />);

    expect(screen.getByText('Your turn')).toBeTruthy();
  });

  it('shows "Waiting for partner" when partner action is needed', () => {
    const session = createMockSession({
      partnerActionNeeded: ['complete_stage'],
    });
    render(<SessionCard session={session} />);

    expect(screen.getByText('Waiting for partner')).toBeTruthy();
  });

  it('renders with testID session-card for regular cards', () => {
    const session = createMockSession();
    render(<SessionCard session={session} />);

    expect(screen.getByTestId('session-card')).toBeTruthy();
  });

  it('renders with testID hero-card when isHero is true', () => {
    const session = createMockSession();
    render(<SessionCard session={session} isHero />);

    expect(screen.getByTestId('hero-card')).toBeTruthy();
  });

  it('navigates to session detail on press', () => {
    const session = createMockSession({ id: 'session-123' });
    render(<SessionCard session={session} />);

    fireEvent.press(screen.getByTestId('session-card'));

    expect(mockPush).toHaveBeenCalledWith('/session/session-123');
  });

  it('shows action indicator badge when action is needed', () => {
    const session = createMockSession({
      selfActionNeeded: ['complete_stage'],
    });
    render(<SessionCard session={session} />);

    expect(screen.getByTestId('action-badge')).toBeTruthy();
  });

  it('does not show action indicator badge when no action is needed', () => {
    const session = createMockSession({
      selfActionNeeded: [],
    });
    render(<SessionCard session={session} />);

    expect(screen.queryByTestId('action-badge')).toBeNull();
  });
});
