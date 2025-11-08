import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CreateProposalModal } from '../components/proposal/CreateProposalModal';

// Mock dependencies
jest.mock('../config/networkConfig', () => ({
  useNetworkVariable: jest.fn((key: string) => {
    if (key === 'packageId') return '0x123';
    if (key === 'dashboardId') return '0x456';
    return '0x000';
  }),
}));

jest.mock('../components/proposal/ProposalImageUpload', () => ({
  __esModule: true,
  default: ({ onUpload }: { onUpload: (data: any) => void }) => (
    <button
      data-testid="image-upload"
      onClick={() => onUpload({ info: { newlyCreated: { blobObject: { blobId: 'test-blob-id' } } }, mediaType: 'image/jpeg' })}
    >
      Upload Image
    </button>
  ),
}));

jest.mock('@mysten/dapp-kit', () => {
  const mockUseCurrentWallet = jest.fn(() => ({
    connectionStatus: 'connected',
    isConnected: true,
  }));
  const mockUseSignAndExecuteTransaction = jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
    isSuccess: false,
    reset: jest.fn(),
  }));
  
  return {
    ConnectButton: ({ connectText, className }: { connectText?: string; className?: string }) => 
      React.createElement('button', { className, 'data-testid': 'connect-button' }, connectText || 'Connect Wallet'),
    useCurrentWallet: mockUseCurrentWallet,
    useSignAndExecuteTransaction: mockUseSignAndExecuteTransaction,
    useSuiClient: jest.fn(() => ({
      waitForTransaction: jest.fn(),
      queryEvents: jest.fn(),
    })),
    useSuiClientQuery: jest.fn(),
    useCurrentAccount: jest.fn(() => null),
    WalletProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    SuiClientProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

describe('CreateProposalModal Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <CreateProposalModal
        isOpen={false}
        onClose={jest.fn()}
        onProposalCreated={jest.fn()}
      />
    );
    expect(screen.queryByText('Create New Proposal')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <CreateProposalModal
        isOpen={true}
        onClose={jest.fn()}
        onProposalCreated={jest.fn()}
      />
    );
    expect(screen.getByText('Create New Proposal')).toBeInTheDocument();
  });

  it('should display all form fields', () => {
    render(
      <CreateProposalModal
        isOpen={true}
        onClose={jest.fn()}
        onProposalCreated={jest.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Enter proposal title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter proposal description')).toBeInTheDocument();
    expect(screen.getByText(/Expiration Date/i)).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(
      <CreateProposalModal
        isOpen={true}
        onClose={onClose}
        onProposalCreated={jest.fn()}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should show connect button when wallet is not connected', () => {
    // Mock wallet as disconnected
    const { useCurrentWallet } = require('@mysten/dapp-kit');
    useCurrentWallet.mockReturnValueOnce({
      connectionStatus: 'disconnected',
      isConnected: false,
    });

    render(
      <CreateProposalModal
        isOpen={true}
        onClose={jest.fn()}
        onProposalCreated={jest.fn()}
      />
    );

    expect(screen.getByTestId('connect-button')).toBeInTheDocument();
  });
});
