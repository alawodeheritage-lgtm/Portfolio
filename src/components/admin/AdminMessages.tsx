import React, { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { INITIAL_ADMIN_MESSAGES } from '../../data/adminMockData';
import { AdminMessageItem } from '../../types/admin';

type MessageFolder = 'inbox' | 'unread' | 'read' | 'archived' | 'all';

interface QuickReplyTemplate {
  id: string;
  title: string;
  description: string;
  body: (senderName: string, subject?: string) => string;
}

const QUICK_REPLY_TEMPLATES: QuickReplyTemplate[] = [
  {
    id: 'acknowledge',
    title: 'Acknowledge Receipt',
    description: 'Confirm inquiry receipt and outline response timeframe',
    body: (name) =>
      `Hi ${name},\n\nThank you for reaching out through my portfolio. I have received your message and will review the details carefully.\n\nI will follow up with you within 24–48 hours.\n\nBest regards,\nHeritage Alawode\nComputer Science Student & Developer`,
  },
  {
    id: 'discuss-project',
    title: 'Schedule Technical Discussion',
    description: 'Propose a short technical meeting or call',
    body: (name, subject) =>
      `Hi ${name},\n\nThanks for your note regarding "${subject || 'our potential collaboration'}". I would be glad to discuss this further.\n\nPlease feel free to propose a couple of time slots that work best for you, or let me know if you prefer continuing the discussion over email.\n\nBest regards,\nHeritage Alawode`,
  },
  {
    id: 'request-details',
    title: 'Request Project Requirements',
    description: 'Ask for additional technical context or specifications',
    body: (name) =>
      `Hi ${name},\n\nThank you for reaching out! To help me understand the scope and technical requirements better, could you share a bit more detail on your expected timeline, deliverables, and technical stack preferences?\n\nLooking forward to hearing from you.\n\nBest regards,\nHeritage Alawode`,
  },
];

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessageItem[]>(INITIAL_ADMIN_MESSAGES);
  const [activeFolder, setActiveFolder] = useState<MessageFolder>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    INITIAL_ADMIN_MESSAGES[0]?.id || ''
  );
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteModalMsgId, setDeleteModalMsgId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  // Trigger feedback toast
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage((current) => (current === text ? null : current));
    }, 2800);
  };

  // Compute folder statistics
  const stats = useMemo(() => {
    const unread = messages.filter((m) => !m.isRead && !m.isArchived).length;
    const read = messages.filter((m) => m.isRead && !m.isArchived).length;
    const archived = messages.filter((m) => m.isArchived).length;
    const inbox = messages.filter((m) => !m.isArchived).length;
    const all = messages.length;
    return { unread, read, archived, inbox, all };
  }, [messages]);

  // Filter messages by active folder and search query
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Folder filtering
      if (activeFolder === 'inbox' && msg.isArchived) return false;
      if (activeFolder === 'unread' && (msg.isRead || msg.isArchived)) return false;
      if (activeFolder === 'read' && (!msg.isRead || msg.isArchived)) return false;
      if (activeFolder === 'archived' && !msg.isArchived) return false;

      // Text search filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSender = msg.senderName.toLowerCase().includes(query);
        const matchesEmail = msg.senderEmail.toLowerCase().includes(query);
        const matchesSubject = (msg.subject || '').toLowerCase().includes(query);
        const matchesBody = msg.message.toLowerCase().includes(query);
        const matchesContext = (msg.projectContext || '').toLowerCase().includes(query);
        const matchesCategory = (msg.category || '').toLowerCase().includes(query);
        return (
          matchesSender ||
          matchesEmail ||
          matchesSubject ||
          matchesBody ||
          matchesContext ||
          matchesCategory
        );
      }

      return true;
    });
  }, [messages, activeFolder, searchQuery]);

  // Currently selected message
  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId);
  }, [messages, selectedMessageId]);

  // Message selection handler
  const handleSelectMessage = (msg: AdminMessageItem) => {
    setSelectedMessageId(msg.id);
    setShowMobileDetail(true);
    // Automatically mark as read on selection if unread
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((item) => (item.id === msg.id ? { ...item, isRead: true } : item))
      );
    }
  };

  // Toggle Read / Unread
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMessages((prev) => {
      const target = prev.find((m) => m.id === id);
      const nextReadState = target ? !target.isRead : true;
      showToast(nextReadState ? 'Marked as read' : 'Marked as unread');
      return prev.map((m) => (m.id === id ? { ...m, isRead: nextReadState } : m));
    });
  };

  // Mark all currently visible messages as read
  const handleMarkAllAsRead = () => {
    const unreadIds = new Set(filteredMessages.filter((m) => !m.isRead).map((m) => m.id));
    if (unreadIds.size === 0) return;

    setMessages((prev) =>
      prev.map((m) => (unreadIds.has(m.id) ? { ...m, isRead: true } : m))
    );
    showToast(`Marked ${unreadIds.size} message${unreadIds.size > 1 ? 's' : ''} as read`);
  };

  // Toggle Archive / Restore
  const handleToggleArchive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMessages((prev) => {
      const target = prev.find((m) => m.id === id);
      const nextArchived = target ? !target.isArchived : false;
      showToast(nextArchived ? 'Message moved to archive' : 'Message restored to inbox');
      return prev.map((m) => (m.id === id ? { ...m, isArchived: nextArchived } : m));
    });
  };

  // Open safe delete confirmation
  const handleOpenDeleteModal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteModalMsgId(id);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteModalMsgId) return;

    const remaining = messages.filter((m) => m.id !== deleteModalMsgId);
    setMessages(remaining);

    // If deleting the active message, select next available
    if (selectedMessageId === deleteModalMsgId) {
      const nextRemaining = filteredMessages.filter((m) => m.id !== deleteModalMsgId);
      setSelectedMessageId(nextRemaining[0]?.id || remaining[0]?.id || '');
    }

    setDeleteModalMsgId(null);
    showToast('Message permanently removed from catalog');
  };

  // Copy Email to clipboard
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast(`Email copied: ${email}`);
  };

  // Copy Quick Reply template
  const handleCopyTemplate = (template: QuickReplyTemplate) => {
    if (!selectedMessage) return;
    const text = template.body(selectedMessage.senderName, selectedMessage.subject);
    navigator.clipboard.writeText(text);
    setSelectedTemplateId(template.id);
    setShowTemplatesDropdown(false);
    showToast(`"${template.title}" template copied to clipboard`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="admin-messages-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="admin-messages-toast"
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-2.5 rounded-lg shadow-lg border border-stone-700 flex items-center gap-2.5 text-xs font-mono"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: Folder Navigation + Real-Time Filter + Bulk Utility */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Folder Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1 lg:pb-0" id="messages-folder-tabs">
          <button
            id="tab-inbox"
            type="button"
            onClick={() => setActiveFolder('inbox')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFolder === 'inbox'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="inbox" size="sm" />
            <span>Inbox ({stats.inbox})</span>
          </button>

          <button
            id="tab-unread"
            type="button"
            onClick={() => setActiveFolder('unread')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFolder === 'unread'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Unread ({stats.unread})</span>
          </button>

          <button
            id="tab-read"
            type="button"
            onClick={() => setActiveFolder('read')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFolder === 'read'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="mark_email_read" size="sm" />
            <span>Read ({stats.read})</span>
          </button>

          <button
            id="tab-archived"
            type="button"
            onClick={() => setActiveFolder('archived')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFolder === 'archived'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="archive" size="sm" />
            <span>Archived ({stats.archived})</span>
          </button>

          <button
            id="tab-all"
            type="button"
            onClick={() => setActiveFolder('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeFolder === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All ({stats.all})
          </button>
        </div>

        {/* Right Search Input and Batch Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Icon
              name="search"
              size="sm"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              id="messages-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, subject, text..."
              className="w-full pl-8 pr-8 py-1.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs font-mono rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors"
            />
            {searchQuery && (
              <button
                id="messages-clear-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                title="Clear search"
              >
                <Icon name="close" size="sm" />
              </button>
            )}
          </div>

          {/* Mark all as read button when unread items exist */}
          {stats.unread > 0 && (
            <button
              id="mark-all-read-btn"
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-2.5 py-1.5 text-xs font-mono text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md border border-stone-200 flex items-center gap-1 whitespace-nowrap transition-colors"
              title="Mark all current messages as read"
            >
              <Icon name="done_all" size="sm" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Master-Detail Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Messages List (Visible on desktop; toggled on mobile) */}
        <div
          className={`lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col ${
            showMobileDetail ? 'hidden lg:flex' : 'flex'
          }`}
          id="messages-list-container"
        >
          {/* List Header */}
          <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-600 font-medium">
              Showing {filteredMessages.length} message{filteredMessages.length === 1 ? '' : 's'}
            </span>
            <span className="text-[11px] text-stone-600">
              Source: Public /contact form
            </span>
          </div>

          {/* List Items or Empty State */}
          <div className="divide-y divide-stone-100 max-h-[700px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="py-14 px-6 text-center space-y-3" id="messages-list-empty">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                  <Icon name="drafts" size="md" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-stone-900">
                    {searchQuery
                      ? 'No matching messages found'
                      : activeFolder === 'unread'
                      ? 'No unread messages'
                      : activeFolder === 'archived'
                      ? 'Archive is empty'
                      : 'No messages in this folder'}
                  </h3>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                    {searchQuery
                      ? `No inquiries match "${searchQuery}". Try revising your keywords or clearing the search.`
                      : activeFolder === 'unread'
                      ? 'All messages have been reviewed. New inquiries will appear here when submitted.'
                      : activeFolder === 'archived'
                      ? 'Messages you move to the archive will be saved here for historical reference.'
                      : 'No messages are currently listed.'}
                  </p>
                </div>
                {(searchQuery || activeFolder !== 'inbox') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFolder('inbox');
                    }}
                  >
                    Reset to Active Inbox
                  </Button>
                )}
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedMessageId;
                return (
                  <div
                    key={msg.id}
                    id={`message-item-${msg.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectMessage(msg)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectMessage(msg);
                      }
                    }}
                    className={`p-4 cursor-pointer transition-all relative border-l-4 text-left outline-none ${
                      isSelected
                        ? 'bg-stone-100/90 border-stone-900'
                        : msg.isRead
                        ? 'bg-white hover:bg-stone-50 border-transparent'
                        : 'bg-amber-50/20 hover:bg-amber-50/40 border-amber-500'
                    }`}
                  >
                    {/* Top line: Sender Name + Timestamp */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Unread Pip */}
                        {!msg.isRead ? (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-600 shrink-0"
                            title="Unread message"
                          />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                        )}
                        <span
                          className={`text-sm truncate ${
                            msg.isRead
                              ? 'font-medium text-stone-800'
                              : 'font-bold text-stone-950'
                          }`}
                        >
                          {msg.senderName}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-stone-600 shrink-0 whitespace-nowrap">
                        {msg.receivedAt}
                      </span>
                    </div>

                    {/* Email address & Category Tag */}
                    <div className="flex items-center justify-between gap-2 pl-4 pt-0.5">
                      <span className="text-xs font-mono text-stone-600 truncate">
                        {msg.senderEmail}
                      </span>
                      {msg.category && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200/80 shrink-0">
                          {msg.category}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div
                      className={`text-xs pl-4 pt-1 line-clamp-1 ${
                        msg.isRead
                          ? 'font-normal text-stone-700'
                          : 'font-semibold text-stone-900'
                      }`}
                    >
                      {msg.subject || 'Direct inquiry'}
                    </div>

                    {/* Short Message Preview */}
                    <p className="text-xs text-stone-600 pl-4 pt-1 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    {/* Hover Utility Action Strip */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 pl-4">
                      {/* Mark Read/Unread Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(msg.id, e)}
                        className="p-1 rounded text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
                        title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        aria-label={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        <Icon
                          name={msg.isRead ? 'mark_email_unread' : 'mark_email_read'}
                          size="sm"
                        />
                      </button>

                      {/* Archive/Restore Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleArchive(msg.id, e)}
                        className="p-1 rounded text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
                        title={msg.isArchived ? 'Restore to inbox' : 'Move to archive'}
                        aria-label={msg.isArchived ? 'Restore to inbox' : 'Move to archive'}
                      >
                        <Icon name={msg.isArchived ? 'unarchive' : 'archive'} size="sm" />
                      </button>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenDeleteModal(msg.id, e)}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete message"
                        aria-label="Delete message"
                      >
                        <Icon name="delete" size="sm" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Detail View */}
        <div
          className={`lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden ${
            showMobileDetail ? 'block' : 'hidden lg:block'
          }`}
          id="messages-detail-container"
        >
          {selectedMessage ? (
            <div className="p-6 space-y-6">
              {/* Mobile Back Button */}
              <div className="lg:hidden pb-3 border-b border-stone-100">
                <button
                  id="mobile-back-to-list-btn"
                  type="button"
                  onClick={() => setShowMobileDetail(false)}
                  className="flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-stone-900"
                >
                  <Icon name="arrow_back" size="sm" />
                  <span>Back to message list</span>
                </button>
              </div>

              {/* Message Header */}
              <div className="border-b border-stone-200 pb-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Subject and Context */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        id="selected-message-subject"
                        className="text-lg font-bold font-display text-stone-950"
                      >
                        {selectedMessage.subject || 'Direct portfolio message'}
                      </h2>

                      {selectedMessage.isArchived && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                          Archived
                        </span>
                      )}

                      {!selectedMessage.isRead && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                          Unread
                        </span>
                      )}
                    </div>

                    {selectedMessage.projectContext && (
                      <div className="text-xs font-mono text-stone-600 flex items-center gap-1">
                        <span>Related to:</span>
                        <strong className="text-stone-800 font-semibold">
                          {selectedMessage.projectContext}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Primary Response / Contact Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      id="respond-via-email-link"
                      href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject || 'Portfolio Inquiry'
                      )}`}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      title="Open external mail client"
                    >
                      <Icon name="reply" size="sm" />
                      <span>Prepare Reply</span>
                    </a>
                  </div>
                </div>

                {/* Sender Identity Card */}
                <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 font-sans">
                      {selectedMessage.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-sm font-sans">
                        {selectedMessage.senderName}
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5">
                        <span>{selectedMessage.senderEmail}</span>
                        <button
                          id="copy-sender-email-btn"
                          type="button"
                          onClick={() => handleCopyEmail(selectedMessage.senderEmail)}
                          className="hover:text-stone-900 underline text-[11px]"
                          title="Copy email to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-stone-600 text-right sm:border-l sm:border-stone-200 sm:pl-3">
                    <div>Received: {selectedMessage.receivedAt}</div>
                    <div className="text-[11px] text-stone-600">Origin: /contact form</div>
                  </div>
                </div>

                {/* Management Action Bar */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      id="toggle-read-status-btn"
                      type="button"
                      onClick={() => handleToggleRead(selectedMessage.id)}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition-colors"
                    >
                      <Icon
                        name={selectedMessage.isRead ? 'mark_email_unread' : 'mark_email_read'}
                        size="sm"
                      />
                      <span>{selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                    </button>

                    <button
                      id="toggle-archive-status-btn"
                      type="button"
                      onClick={() => handleToggleArchive(selectedMessage.id)}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition-colors"
                    >
                      <Icon name={selectedMessage.isArchived ? 'unarchive' : 'archive'} size="sm" />
                      <span>{selectedMessage.isArchived ? 'Restore to Inbox' : 'Archive'}</span>
                    </button>
                  </div>

                  <button
                    id="delete-message-btn"
                    type="button"
                    onClick={() => handleOpenDeleteModal(selectedMessage.id)}
                    className="px-2.5 py-1 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                  >
                    <Icon name="delete" size="sm" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-600">
                  Message Content
                </span>
                <div
                  id="selected-message-body"
                  className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans whitespace-pre-line bg-stone-50/40 p-4 rounded-xl border border-stone-200/60"
                >
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Response Drafting Section */}
              <div className="border-t border-stone-200 pt-5 space-y-3" id="quick-response-drawer">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-600">
                      Response Assist (Clipboard Copy)
                    </span>
                    <p className="text-xs text-stone-600">
                      Select a standard response template to copy formatted text for your email client.
                    </p>
                  </div>
                  <button
                    id="toggle-templates-btn"
                    type="button"
                    onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
                    className="text-xs font-mono text-stone-700 hover:text-stone-950 underline flex items-center gap-1"
                  >
                    <span>{showTemplatesDropdown ? 'Hide Templates' : 'Show Templates'}</span>
                    <Icon name={showTemplatesDropdown ? 'expand_less' : 'expand_more'} size="sm" />
                  </button>
                </div>

                {showTemplatesDropdown && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {QUICK_REPLY_TEMPLATES.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        className="bg-stone-50 hover:bg-stone-100/80 p-3 rounded-lg border border-stone-200 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-stone-900">{tmpl.title}</div>
                          <div className="text-[11px] text-stone-600 leading-normal">
                            {tmpl.description}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyTemplate(tmpl)}
                          className="mt-2 w-full py-1 rounded bg-white hover:bg-stone-200 text-stone-800 text-xs font-mono border border-stone-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Icon name="content_copy" size="sm" />
                          <span>
                            {selectedTemplateId === tmpl.id ? 'Copied!' : 'Copy Template'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dispatch Context Footer */}
              <div className="pt-4 border-t border-stone-200/80 text-xs font-mono text-stone-600 space-y-1">
                <div>Source: Inbound submission via public /contact form</div>
                <div>
                  Recipient address:{' '}
                  <span className="text-stone-800 font-medium">
                    {selectedMessage.senderEmail}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-3" id="messages-detail-empty">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Icon name="mail" size="md" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900">No message selected</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Select an inquiry from the left list to view sender details, full message text, and quick response tools.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalMsgId && (
        <div
          id="delete-confirmation-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Icon name="warning" size="md" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-stone-950">
                  Delete Inbound Message?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  This action will remove the message permanently from your local catalog. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs font-mono text-stone-700 space-y-1">
              <div>
                Sender:{' '}
                <strong>
                  {messages.find((m) => m.id === deleteModalMsgId)?.senderName}
                </strong>
              </div>
              <div className="truncate text-stone-600">
                Subject:{' '}
                {messages.find((m) => m.id === deleteModalMsgId)?.subject || 'Direct inquiry'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                id="cancel-delete-message-btn"
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalMsgId(null)}
              >
                Cancel
              </Button>
              <button
                id="confirm-delete-message-btn"
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold font-mono transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
