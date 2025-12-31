import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApprovals } from '../lib/api';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalDetail {
  id: string;
  businessId: number;
  ownerId: string;
  type: 'claim' | 'create';
  ownerName: string | null;
  ownerEmail: string | null;
  verificationMessage: string | null;
  submissionDate: string;
  approvalStatus: string;
  approvalNotes: string | null;
  reviewedAt: string | null;
  business: {
    id: number;
    name: string;
    cityId: number;
    categoryId: number;
    description: string | null;
    instagramHandle: string | null;
    city?: { id: number; name: string };
    category?: { id: number; name: string; icon: string };
    subcategory?: { id: number; name: string };
  };
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function AdminApprovals() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalDetail | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [error, setError] = useState('');

  const { data: approvals, isLoading } = useQuery({
    queryKey: ['admin-approvals', statusFilter],
    queryFn: () => adminApprovals.getApprovals(statusFilter),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApprovals.approve(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approvals'] });
      setSelectedApproval(null);
      setReviewNotes('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Approval failed');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      adminApprovals.reject(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approvals'] });
      setSelectedApproval(null);
      setReviewNotes('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Rejection failed');
    },
  });

  const handleApprove = () => {
    if (!selectedApproval) return;
    approveMutation.mutate({ id: selectedApproval.id, notes: reviewNotes || undefined });
  };

  const handleReject = () => {
    if (!selectedApproval) return;
    if (!reviewNotes.trim()) {
      setError('Please provide feedback for rejection');
      return;
    }
    rejectMutation.mutate({ id: selectedApproval.id, notes: reviewNotes });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading approvals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Business Approvals
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Review and manage business claims and new submissions
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex gap-4">
            {(['pending', 'approved', 'rejected'] as ApprovalStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
                  statusFilter === status
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status}
                {approvals?.data && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                    {approvals.data.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Approvals List */}
        {approvals?.data && approvals.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {approvals.data.map((approval: ApprovalDetail) => (
              <div
                key={approval.id}
                className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {approval.business.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        approval.type === 'claim'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      }`}>
                        {approval.type === 'claim' ? 'Claim Request' : 'New Business'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {approval.business.city?.name} • {approval.business.category?.icon} {approval.business.category?.name}
                      {approval.business.subcategory && ` → ${approval.business.subcategory.name}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Submitted: {formatDate(approval.submissionDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApproval(approval)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Review
                  </button>
                </div>

                {/* Owner Info */}
                <div className="border-t border-gray-200 dark:border-dark-border pt-4 mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Owner:</span>{' '}
                    {approval.owner.firstName && approval.owner.lastName
                      ? `${approval.owner.firstName} ${approval.owner.lastName}`
                      : approval.ownerName || 'N/A'}{' '}
                    ({approval.owner.email || approval.ownerEmail})
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">No {statusFilter} approvals</p>
          </div>
        )}

        {/* Review Modal */}
        {selectedApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Review {selectedApproval.type === 'claim' ? 'Claim' : 'Submission'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted {formatDate(selectedApproval.submissionDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApproval(null);
                      setReviewNotes('');
                      setError('');
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                {/* Business Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                      {selectedApproval.business.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Location:</span> {selectedApproval.business.city?.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Category:</span> {selectedApproval.business.category?.icon} {selectedApproval.business.category?.name}
                        {selectedApproval.business.subcategory && ` → ${selectedApproval.business.subcategory.name}`}
                      </p>
                      {selectedApproval.business.instagramHandle && (
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Instagram:</span> @{selectedApproval.business.instagramHandle}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedApproval.business.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {selectedApproval.business.description}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner Information</p>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span className="font-medium">Name:</span>{' '}
                        {selectedApproval.owner.firstName && selectedApproval.owner.lastName
                          ? `${selectedApproval.owner.firstName} ${selectedApproval.owner.lastName}`
                          : selectedApproval.ownerName || 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {selectedApproval.owner.email || selectedApproval.ownerEmail}
                      </p>
                    </div>
                  </div>

                  {selectedApproval.verificationMessage && (
                    <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Message
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {selectedApproval.verificationMessage}
                      </p>
                    </div>
                  )}

                  {/* Review Notes Input */}
                  {selectedApproval.approvalStatus === 'pending' && (
                    <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Admin Notes {statusFilter === 'pending' && '(Required for rejection)'}
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => {
                          setReviewNotes(e.target.value);
                          setError('');
                        }}
                        rows={4}
                        placeholder="Add notes about your decision..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Existing Approval Notes (for approved/rejected) */}
                  {selectedApproval.approvalNotes && selectedApproval.approvalStatus !== 'pending' && (
                    <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Notes</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {selectedApproval.approvalNotes}
                      </p>
                      {selectedApproval.reviewedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Reviewed on {formatDate(selectedApproval.reviewedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedApproval.approvalStatus === 'pending' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                    <button
                      onClick={handleReject}
                      disabled={rejectMutation.isPending}
                      className="flex-1 px-6 py-3 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
