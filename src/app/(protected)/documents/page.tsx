'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Calendar,
  User,
  Tag,
  Shield,
  Unlock,
  Lock,
  Clock,
  AlertTriangle
} from 'lucide-react';
import NewDocumentModal from '@/components/NewDocumentModal';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  version: number;
  fileSize: number;
  mimeType: string;
  tags: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  reviewDate: string;
  isPublic: boolean;
  department: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  creator: string;
  createdAt: string;
  updatedAt: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'ISO 27001 Information Security Policy',
    description: 'Comprehensive information security policy document outlining organizational security controls and procedures.',
    category: 'Policy',
    status: 'published',
    version: 2.1,
    fileSize: 2457600,
    mimeType: 'application/pdf',
    tags: ['security', 'policy', 'iso27001', 'information-security'],
    approvalStatus: 'approved',
    reviewDate: '2024-12-15',
    isPublic: true,
    department: 'IT Security',
    riskLevel: 'medium',
    creator: 'John Smith',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20'
  },
  {
    id: '2',
    title: 'GDPR Compliance Checklist',
    description: 'Detailed checklist for ensuring GDPR compliance across all business processes and data handling.',
    category: 'Compliance',
    status: 'review',
    version: 1.0,
    fileSize: 1536000,
    mimeType: 'application/pdf',
    tags: ['gdpr', 'compliance', 'data-protection', 'privacy'],
    approvalStatus: 'pending',
    reviewDate: '2024-11-30',
    isPublic: false,
    department: 'Legal',
    riskLevel: 'high',
    creator: 'Sarah Johnson',
    createdAt: '2024-02-10',
    updatedAt: '2024-06-18'
  },
  {
    id: '3',
    title: 'Risk Assessment Framework',
    description: 'Framework for conducting comprehensive risk assessments across all business operations.',
    category: 'Framework',
    status: 'approved',
    version: 3.0,
    fileSize: 3200000,
    mimeType: 'application/pdf',
    tags: ['risk-management', 'framework', 'assessment', 'business-risk'],
    approvalStatus: 'approved',
    reviewDate: '2024-10-15',
    isPublic: true,
    department: 'Risk Management',
    riskLevel: 'low',
    creator: 'Michael Chen',
    createdAt: '2023-11-20',
    updatedAt: '2024-05-15'
  },
  {
    id: '4',
    title: 'Incident Response Procedure',
    description: 'Standard operating procedures for responding to security incidents and data breaches.',
    category: 'Procedure',
    status: 'draft',
    version: 1.5,
    fileSize: 1894400,
    mimeType: 'application/pdf',
    tags: ['incident-response', 'security', 'procedure', 'breach'],
    approvalStatus: 'pending',
    reviewDate: '2024-12-01',
    isPublic: false,
    department: 'IT Security',
    riskLevel: 'critical',
    creator: 'David Wilson',
    createdAt: '2024-03-05',
    updatedAt: '2024-06-22'
  },
  {
    id: '5',
    title: 'Business Continuity Plan',
    description: 'Comprehensive business continuity and disaster recovery plan for critical business operations.',
    category: 'Plan',
    status: 'published',
    version: 2.0,
    fileSize: 5120000,
    mimeType: 'application/pdf',
    tags: ['business-continuity', 'disaster-recovery', 'planning', 'resilience'],
    approvalStatus: 'approved',
    reviewDate: '2024-09-30',
    isPublic: true,
    department: 'Operations',
    riskLevel: 'medium',
    creator: 'Lisa Brown',
    createdAt: '2023-08-15',
    updatedAt: '2024-04-20'
  }
];

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  published: { label: 'Published', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' }
};

const riskLevelConfig = {
  low: { label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  const statuses = Object.keys(statusConfig);
  const riskLevels = Object.keys(riskLevelConfig);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !categoryFilter || doc.category === categoryFilter;
      const matchesStatus = !statusFilter || doc.status === statusFilter;
      const matchesRisk = !riskFilter || doc.riskLevel === riskFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
    });
  }, [documents, searchTerm, categoryFilter, statusFilter, riskFilter]);

  const handleCreateDocument = async (documentData: any) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      });
      if (!res.ok) throw new Error('Failed to create document');
      const created = await res.json();
      setDocuments(prev => [{
        id: created.id,
        title: created.title,
        description: created.description ?? '',
        category: created.category ?? '',
        status: (created.status?.toString().toLowerCase?.() ?? 'draft') as any,
        version: created.version ?? 1,
        fileSize: created.fileSize ?? 0,
        mimeType: created.mimeType ?? 'text/plain',
        tags: Array.isArray(created.tags) ? created.tags : (created.tags ? JSON.parse(created.tags) : []),
        approvalStatus: 'pending',
        reviewDate: new Date().toISOString().slice(0,10),
        isPublic: created.isPublic ?? false,
        department: documentData.department ?? 'General',
        riskLevel: (documentData.riskLevel ?? 'medium').toLowerCase(),
        creator: 'You',
        createdAt: created.createdAt ?? new Date().toISOString(),
        updatedAt: created.updatedAt ?? new Date().toISOString(),
      }, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalOpen(false);
    }
  };

  const openDetails = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedDoc(null);
  };

  async function handleDeleteDocument(id: string) {
    const confirmDelete = window.confirm('Delete this document? This action cannot be undone.');
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.warn('API delete failed, removing locally.');
      }
    } catch (e) {
      console.warn('Network error during delete, removing locally.');
    } finally {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  }

  async function handleEditDocument(doc: Document) {
    const newTitle = window.prompt('Update title', doc.title) ?? doc.title;
    const newDescription = window.prompt('Update description', doc.description) ?? doc.description;
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      if (!res.ok) {
        console.warn('API update failed, updating locally.');
      } else {
        const updated = await res.json();
        setDocuments(prev => prev.map(d => d.id === doc.id ? {
          ...d,
          title: updated.title ?? newTitle,
          description: updated.description ?? newDescription,
          updatedAt: updated.updatedAt ?? new Date().toISOString(),
        } : d));
        return;
      }
    } catch (e) {
      console.warn('Network error during update, updating locally.');
    } finally {
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, title: newTitle, description: newDescription, updatedAt: new Date().toISOString() } : d));
    }
  }

  function downloadBlob(content: string, filename: string, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadDocument(doc: Document) {
    // If an uploaded file exists, navigate to it; else fallback to text summary
    // @ts-ignore
    const fileUrl = (doc as any).fileUrl as string | undefined;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      return;
    }
    const summary = `Title: ${doc.title}\nCategory: ${doc.category}\nVersion: ${doc.version}\nDescription: ${doc.description}`;
    downloadBlob(summary, `${doc.title.replace(/[^a-z0-9]/gi, '_')}.txt`);
  }

  const getDaysUntilReview = (reviewDate: string) => {
    const today = new Date();
    const review = new Date(reviewDate);
    const diffTime = review.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Control</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize your compliance documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">{documents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Under Review</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(doc => doc.status === 'review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(doc => doc.approvalStatus === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(doc => ['high', 'critical'].includes(doc.riskLevel)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search Documents
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                id="search"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{statusConfig[status as keyof typeof statusConfig].label}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label htmlFor="risk" className="block text-sm font-medium text-foreground mb-2">
              Risk Level
            </label>
            <select
              id="risk"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            >
              <option value="">All Risk Levels</option>
              {riskLevels.map(risk => (
                <option key={risk} value={risk}>{riskLevelConfig[risk as keyof typeof riskLevelConfig].label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const daysUntilReview = getDaysUntilReview(doc.reviewDate);
            const isReviewOverdue = daysUntilReview < 0;
            
            return (
              <div key={doc.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Document Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      {doc.isPublic ? (
                        <Unlock className="h-4 w-4 text-green-600" aria-label="Public Document" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" aria-label="Private Document" />
                      )}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        +{doc.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Status and Risk */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[doc.status].color}`}>
                      {statusConfig[doc.status].label}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskLevelConfig[doc.riskLevel].color}`}>
                      {riskLevelConfig[doc.riskLevel].label} Risk
                    </span>
                  </div>
                </div>

                {/* Document Details */}
                <div className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium text-foreground">{doc.version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium text-foreground">{formatFileSize(doc.fileSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium text-foreground">{doc.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Creator</p>
                      <p className="font-medium text-foreground">{doc.creator}</p>
                    </div>
                  </div>

                  {/* Review Date */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Review by:</span>
                        <span className={`ml-1 font-medium ${
                          isReviewOverdue ? 'text-red-600' : 'text-foreground'
                        }`}>
                          {doc.reviewDate}
                        </span>
                      </div>
                      {isReviewOverdue && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openDetails(doc)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEditDocument(doc)} className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDownloadDocument(doc)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View Placeholder */}
      {viewMode === 'list' && (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">List View</h3>
          <p className="text-muted-foreground">
            List view will be implemented in the next iteration.
          </p>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Document
          </button>
        </div>
      )}

      {/* New Document Modal */}
      <NewDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDocument}
      />
      {isDetailsOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">{selectedDoc.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedDoc.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{selectedDoc.category}</span></div>
              <div><span className="text-muted-foreground">Version:</span> <span className="text-foreground">{selectedDoc.version}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <span className="text-foreground">{selectedDoc.status}</span></div>
              <div><span className="text-muted-foreground">Department:</span> <span className="text-foreground">{selectedDoc.department}</span></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeDetails} className="px-4 py-2 rounded-md border border-input text-foreground hover:bg-accent">Close</button>
              <button onClick={() => handleDownloadDocument(selectedDoc)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
