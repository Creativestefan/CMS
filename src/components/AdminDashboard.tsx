import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Plus, Trash2, Save, LogOut, Edit, X, ArrowUp, ArrowDown } from "lucide-react";

interface Profile {
  name: string;
  bio: string;
  twitter: string;
  linkedin: string;
  github: string;
  dribbble: string;
  location: string;
  letsTalkUrl: string;
}

interface Work {
  id: string;
  year: string;
  client: string;
  type: string;
  subtype: string;
  link: string;
  order: number;
}

interface PlaygroundItem {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "gif";
  category: string;
  externalLink?: string;
  order: number;
  featured?: boolean;
  score?: number; // 1-5, default 5 (highest priority)
}

interface WorkExperience {
  id: string;
  startYear: string;
  endYear?: string;
  position: string;
  company: string;
  companyLogo: string;
  companyLink?: string;
  order: number;
}

interface AboutData {
  profileImage: string;
  bio: string[];
}

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "works" | "playground" | "about" | "security">("profile");
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    twitter: "",
    linkedin: "",
    github: "",
    dribbble: "",
    location: "",
    letsTalkUrl: "",
  });
  const [works, setWorks] = useState<Work[]>([]);
  const [playgroundItems, setPlaygroundItems] = useState<PlaygroundItem[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>({
    profileImage: "",
    bio: [""],
  });
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Security tab state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Edit sheet state
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Featured playground reorder sheet state - REMOVED

  // Playground upload state
  const [editingPlaygroundItem, setEditingPlaygroundItem] = useState<PlaygroundItem | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Work Experience edit state
  const [editingWorkExperience, setEditingWorkExperience] = useState<WorkExperience | null>(null);
  const [isWorkExperienceSheetOpen, setIsWorkExperienceSheetOpen] = useState(false);

  // About page file states
  const [pendingProfileImageFile, setPendingProfileImageFile] = useState<File | null>(null);
  const [pendingCompanyLogoFile, setPendingCompanyLogoFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

  // Tab transition state
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [nextTab, setNextTab] = useState<"profile" | "works" | "playground" | "about" | "security" | null>(null);

  // Industry categories for playground
  const industryCategories = [
    "AI & Machine Learning",
    "Web3 & Blockchain",
    "E-commerce",
    "Fintech",
    "Healthcare",
    "Education",
    "Entertainment & Media",
    "Social Media",
    "Productivity & Tools",
    "Travel & Hospitality",
    "Real Estate",
    "Food & Beverage",
    "Fashion & Beauty",
    "Sports & Fitness",
    "Gaming",
    "SaaS",
    "Automotive",
    "Energy & Environment",
    "Agriculture",
    "Other"
  ];

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c0b89456`;

  useEffect(() => {
    loadProfile();
    loadWorks();
    loadPlaygroundItems();
    loadAboutData();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${serverUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log(`AdminDashboard - Error loading profile: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log('AdminDashboard - Profile data loaded:', data);
      setProfile(data);
    } catch (error) {
      console.log(`AdminDashboard - Error loading profile: ${error}`);
    }
  };

  const loadWorks = async () => {
    try {
      const response = await fetch(`${serverUrl}/works`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log(`AdminDashboard - Error loading works: ${response.status}`);
        setWorks([]);
        return;
      }

      const data = await response.json();
      console.log('AdminDashboard - Works data loaded:', data);
      if (Array.isArray(data)) {
        setWorks(data);
      } else {
        setWorks([]);
      }
    } catch (error) {
      console.log(`AdminDashboard - Error loading works: ${error}`);
      setWorks([]);
    }
  };

  const loadPlaygroundItems = async () => {
    try {
      const response = await fetch(`${serverUrl}/playground/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log(`AdminDashboard - Error loading playground items: ${response.status}`);
        setPlaygroundItems([]);
        return;
      }

      const data = await response.json();
      console.log('AdminDashboard - Playground items data loaded:', data);
      if (Array.isArray(data)) {
        setPlaygroundItems(data);
      } else {
        setPlaygroundItems([]);
      }
    } catch (error) {
      console.log(`AdminDashboard - Error loading playground items: ${error}`);
      setPlaygroundItems([]);
    }
  };

  const loadAboutData = async () => {
    try {
      const response = await fetch(`${serverUrl}/about/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log(`AdminDashboard - Error loading about data: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log('AdminDashboard - About data loaded:', data);

      if (data.profile) {
        setAboutData(data.profile);
      }

      if (data.workExperience && Array.isArray(data.workExperience)) {
        setWorkExperience(data.workExperience);
      }
    } catch (error) {
      console.log(`AdminDashboard - Error loading about data: ${error}`);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage("");
    try {
      console.log('AdminDashboard - Saving profile:', profile);
      const response = await fetch(`${serverUrl}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log('AdminDashboard - Error saving profile:', error);
        setMessage(`Error: ${error.error}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('AdminDashboard - Profile saved successfully:', result);
      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.log(`AdminDashboard - Error saving profile: ${error}`);
      setMessage("Failed to save profile");
    }
    setLoading(false);
  };

  const addWork = async () => {
    // Open sheet with new work template
    const newWork: Work = {
      id: '', // Empty id indicates new work
      year: new Date().getFullYear().toString(),
      client: '',
      type: '',
      subtype: '',
      link: '',
      order: works.length,
    };
    setEditingWork(newWork);
    setIsAddingNew(true);
    setIsSheetOpen(true);
  };

  const createWork = async (work: Omit<Work, 'id'>) => {
    try {
      const response = await fetch(`${serverUrl}/works`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(work),
      });

      if (response.ok) {
        setMessage("Work created successfully!");
        setTimeout(() => setMessage(""), 3000);
        loadWorks();
        setIsSheetOpen(false);
        setEditingWork(null);
        setIsAddingNew(false);
      }
    } catch (error) {
      console.log(`Error creating work: ${error}`);
    }
  };

  const updateWork = async (work: Work) => {
    try {
      const response = await fetch(`${serverUrl}/works/${encodeURIComponent(work.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(work),
      });

      if (response.ok) {
        setMessage("Work updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        loadWorks();
        setIsSheetOpen(false);
        setEditingWork(null);
      }
    } catch (error) {
      console.log(`Error updating work: ${error}`);
    }
  };

  const deleteWork = async (workId: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;

    try {
      const response = await fetch(`${serverUrl}/works/${encodeURIComponent(workId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        loadWorks();
      }
    } catch (error) {
      console.log(`Error deleting work: ${error}`);
    }
  };

  const moveWork = async (index: number, direction: "up" | "down") => {
    const newWorks = [...works];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newWorks.length) return;

    [newWorks[index], newWorks[targetIndex]] = [newWorks[targetIndex], newWorks[index]];

    newWorks.forEach((work, i) => {
      work.order = i;
    });

    setWorks(newWorks);

    for (const work of newWorks) {
      await updateWork(work);
    }
  };

  const openEditWork = (work: Work) => {
    setEditingWork({ ...work });
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => {
      setEditingWork(null);
      setEditingPlaygroundItem(null);
      setIsAddingNew(false);
      setSelectedFile(null);
      setFilePreview(null);
    }, 300);
  };

  const handleTabChange = (tab: "profile" | "works" | "playground" | "about" | "security") => {
    setIsTabTransitioning(true);
    setNextTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabTransitioning(false);
      setNextTab(null);
    }, 300);
  };

  // Playground file upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Auto-detect media type from file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    let detectedType: 'image' | 'video' | 'gif' = 'image';

    if (extension === 'gif') {
      detectedType = 'gif';
    } else if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension || '')) {
      detectedType = 'video';
    } else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension || '')) {
      detectedType = 'image';
    }

    // Update media type automatically
    if (editingPlaygroundItem) {
      setEditingPlaygroundItem({
        ...editingPlaygroundItem,
        mediaType: detectedType,
      });
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadFileToCloudflare = async (file: File): Promise<string | null> => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file to Cloudflare:', file.name, file.type);

      const response = await fetch(`${serverUrl}/upload-cloudflare`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log('Error uploading file:', error);

        // Show clear error message
        let errorMessage = 'Upload failed. ';
        if (error.error && error.error.includes('R2 Authentication failed')) {
          errorMessage = 'R2 Authentication failed. Please check your Cloudflare R2 credentials (Account ID, Access Key, and Secret Key) in the Supabase environment variables.';
        } else {
          errorMessage += error.error || 'Unknown error';
        }

        setMessage(errorMessage);
        setTimeout(() => setMessage(''), 8000); // Longer timeout for error messages
        return null;
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
      setMessage('File uploaded successfully!');
      setTimeout(() => setMessage(''), 2000);
      return result.url;
    } catch (error) {
      console.log('Error uploading file:', error);
      setMessage('Failed to upload file. Please check your connection and try again.');
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // About page functions
  const saveAboutProfile = async () => {
    setLoading(true);
    setMessage("");
    try {
      let profileImageUrl = aboutData.profileImage;

      // Upload profile image if there's a pending file
      if (pendingProfileImageFile) {
        const uploadedUrl = await uploadAboutImage(pendingProfileImageFile, "profile");
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      const dataToSave = {
        ...aboutData,
        profileImage: profileImageUrl,
      };

      const response = await fetch(`${serverUrl}/about/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
        setLoading(false);
        return;
      }

      // Update local state with saved data
      setAboutData(dataToSave);

      // Clear pending file states
      setPendingProfileImageFile(null);
      setProfileImagePreview(null);

      setMessage("About profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.log(`Error saving about profile: ${error}`);
      setMessage("Failed to save about profile");
    }
    setLoading(false);
  };

  const addBioParagraph = () => {
    setAboutData({
      ...aboutData,
      bio: [...aboutData.bio, ""],
    });
  };

  const updateBioParagraph = (index: number, value: string) => {
    const newBio = [...aboutData.bio];
    newBio[index] = value;
    setAboutData({
      ...aboutData,
      bio: newBio,
    });
  };

  const removeBioParagraph = (index: number) => {
    if (aboutData.bio.length <= 1) return;
    const newBio = aboutData.bio.filter((_: string, i: number) => i !== index);
    setAboutData({
      ...aboutData,
      bio: newBio,
    });
  };

  const uploadAboutImage = async (file: File, type: "profile" | "company") => {
    const url = await uploadFileToCloudflare(file);
    return url;
  };

  const openAddWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: `exp-${Date.now()}`,
      startYear: "",
      endYear: "",
      position: "",
      company: "",
      companyLogo: "",
      companyLink: "",
      order: workExperience.length,
    };
    setEditingWorkExperience(newExperience);
    setIsWorkExperienceSheetOpen(true);
  };

  const openEditWorkExperience = (exp: WorkExperience) => {
    setEditingWorkExperience({ ...exp });
    setPendingCompanyLogoFile(null);
    setCompanyLogoPreview(null);
    setIsWorkExperienceSheetOpen(true);
  };

  const saveWorkExperience = async () => {
    if (!editingWorkExperience) return;

    // Validate years
    if (editingWorkExperience.startYear && editingWorkExperience.endYear) {
      const startYear = parseInt(editingWorkExperience.startYear);
      const endYear = parseInt(editingWorkExperience.endYear);

      if (startYear > endYear) {
        setMessage("Start year cannot be later than end year");
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    setLoading(true);
    try {
      let companyLogoUrl = editingWorkExperience.companyLogo;

      // Upload company logo if there's a pending file
      if (pendingCompanyLogoFile) {
        const uploadedUrl = await uploadAboutImage(pendingCompanyLogoFile, "company");
        if (uploadedUrl) {
          companyLogoUrl = uploadedUrl;
        }
      }

      const dataToSave = {
        ...editingWorkExperience,
        companyLogo: companyLogoUrl,
      };

      const isNew = !workExperience.find((exp: WorkExperience) => exp.id === editingWorkExperience.id);
      const url = isNew
        ? `${serverUrl}/about/experience`
        : `${serverUrl}/about/experience/${encodeURIComponent(editingWorkExperience.id)}`;

      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        if (isNew) {
          setWorkExperience([...workExperience, dataToSave]);
        } else {
          setWorkExperience(workExperience.map((exp: WorkExperience) =>
            exp.id === dataToSave.id ? dataToSave : exp
          ));
        }

        // Clear pending file states
        setPendingCompanyLogoFile(null);
        setCompanyLogoPreview(null);

        setMessage(isNew ? "Work experience added!" : "Work experience updated!");
        setTimeout(() => setMessage(""), 2000);
        setIsWorkExperienceSheetOpen(false);
        setTimeout(() => setEditingWorkExperience(null), 300);
      }
    } catch (error) {
      console.log(`Error saving work experience: ${error}`);
      setMessage("Failed to save work experience");
    }
    setLoading(false);
  };

  const deleteWorkExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work experience?")) return;

    try {
      const response = await fetch(`${serverUrl}/about/experience/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setWorkExperience(workExperience.filter((exp: WorkExperience) => exp.id !== id));
        setMessage("Work experience deleted!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.log(`Error deleting work experience: ${error}`);
    }
  };

  const openAddPlaygroundItem = () => {
    const newItem: PlaygroundItem = {
      id: '',
      mediaUrl: '',
      mediaType: 'image',
      category: 'AI & Machine Learning',
      externalLink: '',
      order: playgroundItems.length,
      score: 5, // Default to highest score
    };
    setEditingPlaygroundItem(newItem);
    setSelectedFile(null);
    setFilePreview(null);
    setIsSheetOpen(true);
  };

  const openEditPlaygroundItem = (item: PlaygroundItem) => {
    setEditingPlaygroundItem({ ...item });
    setSelectedFile(null);
    setFilePreview(item.mediaUrl);
    setIsSheetOpen(true);
  };

  const savePlaygroundItem = async () => {
    if (!editingPlaygroundItem) return;

    try {
      let mediaUrl = editingPlaygroundItem.mediaUrl;

      // Upload file if selected
      if (selectedFile) {
        const uploadedUrl = await uploadFileToCloudflare(selectedFile);
        if (!uploadedUrl) {
          return; // Error message already set by uploadFileToCloudflare
        }
        mediaUrl = uploadedUrl;
      }

      if (!mediaUrl) {
        setMessage('Please upload a file or provide a media URL');
        return;
      }

      const itemData = {
        ...editingPlaygroundItem,
        mediaUrl,
      };

      console.log('Saving playground item:', itemData);
      console.log('Item ID:', editingPlaygroundItem.id);
      console.log('Is creating new?', !editingPlaygroundItem.id);

      // Determine if creating or updating
      if (!editingPlaygroundItem.id) {
        // Create new item
        const response = await fetch(`${serverUrl}/playground`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          setMessage('Playground item created successfully!');
          setTimeout(() => setMessage(''), 3000);
          loadPlaygroundItems();
          closeSheet();
        } else {
          const error = await response.json();
          console.log('Error creating playground item:', error);
          setMessage(`Failed to create: ${error.error || 'Unknown error'}. Please try logging in again.`);
        }
      } else {
        // Update existing item
        const response = await fetch(`${serverUrl}/playground/${encodeURIComponent(editingPlaygroundItem.id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          setMessage('Playground item updated successfully!');
          setTimeout(() => setMessage(''), 3000);
          loadPlaygroundItems();
          closeSheet();
        } else {
          const error = await response.json();
          console.log('Error updating playground item:', error);
          setMessage(`Failed to update: ${error.error || 'Unknown error'}. Please try logging in again.`);
        }
      }
    } catch (error) {
      console.log('Error saving playground item:', error);
      setMessage('Failed to save playground item. Please check your connection and try again.');
    }
  };

  const deletePlaygroundItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this playground item?')) return;

    try {
      const response = await fetch(`${serverUrl}/playground/${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        loadPlaygroundItems();
      }
    } catch (error) {
      console.log('Error deleting playground item:', error);
    }
  };

  const movePlaygroundItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...playgroundItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    newItems.forEach((item, i) => {
      item.order = i;
    });

    setPlaygroundItems(newItems);

    for (const item of newItems) {
      await fetch(`${serverUrl}/playground/${encodeURIComponent(item.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(item),
      });
    }
  };

  const toggleFeatured = async (item: PlaygroundItem) => {
    try {
      const updatedItem = { ...item, featured: !item.featured };

      const response = await fetch(`${serverUrl}/playground/${encodeURIComponent(item.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        loadPlaygroundItems();
      }
    } catch (error) {
      console.log('Error toggling featured status:', error);
    }
  };



  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1>CMS Dashboard</h1>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
            >
              View Site
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity border border-border"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {message && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-[var(--radius)] text-primary">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabChange("profile")}
            className={`px-4 py-2 rounded-[var(--radius-button)] transition-colors ${activeTab === "profile"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80 border border-border"
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleTabChange("works")}
            className={`px-4 py-2 rounded-[var(--radius-button)] transition-colors ${activeTab === "works"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80 border border-border"
              }`}
          >
            Works
          </button>
          <button
            onClick={() => handleTabChange("playground")}
            className={`px-4 py-2 rounded-[var(--radius-button)] transition-colors ${activeTab === "playground"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80 border border-border"
              }`}
          >
            Playground
          </button>
          <button
            onClick={() => handleTabChange("about")}
            className={`px-4 py-2 rounded-[var(--radius-button)] transition-colors ${activeTab === "about"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80 border border-border"
              }`}
          >
            About
          </button>
          <button
            onClick={() => handleTabChange("security")}
            className={`px-4 py-2 rounded-[var(--radius-button)] transition-colors ${activeTab === "security"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80 border border-border"
              }`}
          >
            Security
          </button>
        </div>

        {/* Tab Content with Fade Transition */}
        <div
          className="transition-opacity duration-300 ease-in-out"
          style={{ opacity: isTabTransitioning ? 0 : 1 }}
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-[var(--radius-card)] p-6">
              <h2 className="mb-6">Profile Settings</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={profile.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="twitter" className="block mb-2">
                      Twitter/X
                    </label>
                    <input
                      id="twitter"
                      type="text"
                      value={profile.twitter}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, twitter: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block mb-2">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      type="text"
                      value={profile.linkedin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="github" className="block mb-2">
                      Github
                    </label>
                    <input
                      id="github"
                      type="text"
                      value={profile.github}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="dribbble" className="block mb-2">
                      Dribbble
                    </label>
                    <input
                      id="dribbble"
                      type="text"
                      value={profile.dribbble}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, dribbble: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="letsTalkUrl" className="block mb-2">
                    Let's Talk URL
                  </label>
                  <input
                    id="letsTalkUrl"
                    type="url"
                    value={profile.letsTalkUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setProfile({ ...profile, letsTalkUrl: e.target.value })}
                    placeholder="https://calendly.com/yourname or mailto:you@email.com"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={saveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* Works Tab */}
          {activeTab === "works" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2>Works</h2>
                <div className="flex gap-2">

                  <button
                    onClick={addWork}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Work
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-muted-foreground">Order</th>
                      <th className="px-4 py-3 text-left text-muted-foreground">Year</th>
                      <th className="px-4 py-3 text-left text-muted-foreground">Client</th>
                      <th className="px-4 py-3 text-left text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-muted-foreground">Subtype</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {works.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No works yet. Add one to get started.
                        </td>
                      </tr>
                    ) : (
                      works.map((work: Work, index: number) => (
                        <tr key={work.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveWork(index, "up")}
                                disabled={index === 0}
                                className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveWork(index, "down")}
                                disabled={index === works.length - 1}
                                className="p-1 hover:bg-muted rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">{work.year}</td>
                          <td className="px-4 py-3">{work.client}</td>
                          <td className="px-4 py-3">{work.type}</td>
                          <td className="px-4 py-3 text-muted-foreground">{work.subtype}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => openEditWork(work)}
                                className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-[var(--radius-button)] hover:opacity-80 transition-opacity"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteWork(work.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Playground Tab */}
          {activeTab === "playground" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2>Playground</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Items are sorted by score (5-1), then by custom order within each score group.
                  </p>
                </div>
                <div className="flex gap-2">

                  <button
                    onClick={openAddPlaygroundItem}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Playground Item
                  </button>
                </div>
              </div>

              <div
                className="bg-card border border-border rounded-[var(--radius-card)] overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Preview</th>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Media URL</th>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Type</th>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Category</th>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Score</th>
                      <th className="px-4 py-3 text-left text-muted-foreground whitespace-nowrap">Featured</th>
                      <th className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playgroundItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No playground items yet. Add one to get started.
                        </td>
                      </tr>
                    ) : (
                      playgroundItems.map((item: PlaygroundItem, index: number) => (
                        <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                          <td className="px-4 py-3">
                            {item.mediaUrl ? (
                              <div className="w-16 h-16 rounded-[var(--radius)] border border-border overflow-hidden bg-muted flex items-center justify-center">
                                {item.mediaType === 'video' ? (
                                  <video
                                    src={item.mediaUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => {
                                      const video = e.currentTarget;
                                      video.play().catch(() => {
                                        // Silent fail if autoplay blocked
                                      });
                                    }}
                                    onMouseLeave={(e) => {
                                      const video = e.currentTarget;
                                      video.pause();
                                      video.currentTime = 0;
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={item.mediaUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-[var(--radius)] border border-border bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                No media
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-xs truncate text-muted-foreground">
                              {item.mediaUrl || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                              {item.mediaType}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                                {item.score || 5}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.score === 1 ? 'Lowest' : item.score === 2 ? 'Low' : item.score === 3 ? 'Medium' : item.score === 4 ? 'High' : 'Highest'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleFeatured(item)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.featured ? 'bg-primary' : 'bg-muted'
                                }`}
                              role="switch"
                              aria-checked={item.featured}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.featured ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => openEditPlaygroundItem(item)}
                                className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-[var(--radius-button)] hover:opacity-80 transition-opacity"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => deletePlaygroundItem(item.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* About Profile Section */}
              <div className="bg-card border border-border rounded-[var(--radius-card)] p-6">
                <h2 className="mb-6">About Profile</h2>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label htmlFor="profileImage" className="block mb-2">
                      Profile Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="profileImage"
                        type="text"
                        value={aboutData.profileImage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setAboutData({ ...aboutData, profileImage: e.target.value })}
                        className="flex-1 px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="https://... or select a file"
                        disabled={!!pendingProfileImageFile}
                      />
                      <label className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity cursor-pointer">
                        Select File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPendingProfileImageFile(file);
                              const previewUrl = URL.createObjectURL(file);
                              setProfileImagePreview(previewUrl);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {pendingProfileImageFile && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Selected: {pendingProfileImageFile.name} (will upload on save)
                      </div>
                    )}
                    {(profileImagePreview || aboutData.profileImage) && (
                      <img
                        src={profileImagePreview || aboutData.profileImage}
                        alt="Profile preview"
                        className="mt-2 w-24 h-24 object-cover rounded-[var(--radius)]"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block">Bio Paragraphs</label>
                      <button
                        onClick={addBioParagraph}
                        className="flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3 h-3" />
                        Add Paragraph
                      </button>
                    </div>
                    {aboutData.bio.map((paragraph: string, index: number) => (
                      <div key={index} className="mb-3 flex gap-2">
                        <textarea
                          value={paragraph}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateBioParagraph(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                          placeholder={`Paragraph ${index + 1}...`}
                        />
                        {aboutData.bio.length > 1 && (
                          <button
                            onClick={() => removeBioParagraph(index)}
                            className="px-3 py-2 bg-destructive text-destructive-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveAboutProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save About Profile"}
                  </button>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="bg-card border border-border rounded-[var(--radius-card)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2>Work Experience</h2>
                  <button
                    onClick={openAddWorkExperience}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-3">
                  {workExperience.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No work experience added yet. Click "Add Experience" to get started.
                    </p>
                  ) : (
                    workExperience.map((exp) => (
                      <div
                        key={exp.id}
                        className="border border-border rounded-[var(--radius)] p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {exp.companyLogo && (
                            <img
                              src={exp.companyLogo}
                              alt={exp.company}
                              className="w-10 h-10 object-cover rounded-[var(--radius)]"
                            />
                          )}
                          <div>
                            <p className="text-foreground">
                              {exp.startYear}{exp.endYear ? ` - ${exp.endYear}` : ' - Present'} • {exp.position} {exp.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditWorkExperience(exp)}
                            className="flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteWorkExperience(exp.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-card border border-border rounded-[var(--radius-card)] p-6">
              <h2 className="mb-6">Security Settings</h2>
              <div className="space-y-4 max-w-md">
                <p className="text-muted-foreground mb-4">
                  Update your password to keep your account secure.
                </p>

                <div>
                  <label htmlFor="new-password" className="block mb-2">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] text-destructive">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-[var(--radius)] text-primary">
                    {passwordSuccess}
                  </div>
                )}

                <button
                  onClick={async () => {
                    setPasswordError("");
                    setPasswordSuccess("");

                    // Validation
                    if (!newPassword || !confirmPassword) {
                      setPasswordError("All fields are required");
                      return;
                    }

                    if (newPassword.length < 6) {
                      setPasswordError("New password must be at least 6 characters");
                      return;
                    }

                    if (newPassword !== confirmPassword) {
                      setPasswordError("New passwords do not match");
                      return;
                    }

                    try {
                      setLoading(true);

                      // Update to new password
                      const { data: { user }, error: updateError } = await supabase.auth.updateUser({
                        password: newPassword
                      });

                      if (updateError) {
                        setPasswordError(updateError.message);
                        setLoading(false);
                        return;
                      }

                      setPasswordSuccess("Password updated successfully!");
                      setNewPassword("");
                      setConfirmPassword("");
                      setLoading(false);
                    } catch (error) {
                      console.error("Error updating password:", error);
                      setPasswordError("An error occurred while updating password");
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Edit Sheet - Slides in from right */}
      {isSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
            style={{ opacity: isSheetOpen ? 1 : 0 }}
            onClick={closeSheet}
          />

          {/* Sheet */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg z-50 overflow-y-auto transition-transform duration-300"
            style={{ transform: isSheetOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2>
                  {editingPlaygroundItem
                    ? (editingPlaygroundItem.id ? "Edit Playground Item" : "Add Playground Item")
                    : isAddingNew
                      ? "Add Work"
                      : "Edit Work"}
                </h2>
                <button
                  onClick={closeSheet}
                  className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Work Form */}
              {editingWork && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-year" className="block mb-2">
                      Year
                    </label>
                    <input
                      id="edit-year"
                      type="text"
                      value={editingWork.year}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingWork({ ...editingWork, year: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-client" className="block mb-2">
                      Client
                    </label>
                    <input
                      id="edit-client"
                      type="text"
                      value={editingWork.client}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingWork({ ...editingWork, client: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-type" className="block mb-2">
                      Type
                    </label>
                    <input
                      id="edit-type"
                      type="text"
                      value={editingWork.type}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingWork({ ...editingWork, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-subtype" className="block mb-2">
                      Subtype
                    </label>
                    <input
                      id="edit-subtype"
                      type="text"
                      value={editingWork.subtype}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingWork({ ...editingWork, subtype: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-link" className="block mb-2">
                      Link
                    </label>
                    <input
                      id="edit-link"
                      type="text"
                      value={editingWork.link}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingWork({ ...editingWork, link: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="pt-4 flex gap-2">
                    {isAddingNew ? (
                      <button
                        onClick={() => createWork(editingWork as Omit<Work, 'id'>)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                      >
                        <Save className="w-4 h-4" />
                        Create Work
                      </button>
                    ) : (
                      <button
                        onClick={() => updateWork(editingWork)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    )}
                    <button
                      onClick={closeSheet}
                      className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-[var(--radius-button)] hover:opacity-80 transition-opacity"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Playground Item Form */}
              {editingPlaygroundItem && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-mediaUrl" className="block mb-2">
                      Media URL (optional)
                    </label>
                    <input
                      id="edit-mediaUrl"
                      type="text"
                      value={editingPlaygroundItem.mediaUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                        const url = e.target.value;

                        // Auto-detect media type from URL
                        let detectedType: 'image' | 'video' | 'gif' = editingPlaygroundItem.mediaType;

                        if (url) {
                          const urlLower = url.toLowerCase();

                          if (urlLower.includes('.gif')) {
                            detectedType = 'gif';
                          } else if (urlLower.includes('.mp4') || urlLower.includes('.mov') || urlLower.includes('.avi') || urlLower.includes('.webm') || urlLower.includes('.mkv') || urlLower.includes('video')) {
                            detectedType = 'video';
                          } else if (urlLower.includes('.jpg') || urlLower.includes('.jpeg') || urlLower.includes('.png') || urlLower.includes('.webp') || urlLower.includes('image')) {
                            detectedType = 'image';
                          }
                        }

                        // Update both URL and media type in a single state update
                        setEditingPlaygroundItem({ ...editingPlaygroundItem, mediaUrl: url, mediaType: detectedType });
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Or upload a file below
                    </p>
                  </div>

                  <div>
                    <label htmlFor="edit-file" className="block mb-2">
                      Upload File (optional)
                    </label>
                    <input
                      id="edit-file"
                      type="file"
                      accept="image/*,video/*,.gif"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {filePreview && (
                      <div className="mt-2">
                        {editingPlaygroundItem.mediaType === 'video' ? (
                          <video
                            src={filePreview}
                            className="max-w-full h-auto rounded-[var(--radius)]"
                            controls
                          />
                        ) : (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="max-w-full h-auto rounded-[var(--radius)]"
                          />
                        )}
                      </div>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      Media type will be auto-detected
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2">
                      Media Type <span className="text-muted-foreground">(auto-detected)</span>
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-[var(--radius)]">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                        {editingPlaygroundItem.mediaType.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Detected from file or URL
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block mb-2">
                      Category
                    </label>
                    <select
                      id="edit-category"
                      value={editingPlaygroundItem.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingPlaygroundItem({ ...editingPlaygroundItem, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {industryCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-externalLink" className="block mb-2">
                      External Link
                    </label>
                    <input
                      id="edit-externalLink"
                      type="text"
                      value={editingPlaygroundItem.externalLink || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setEditingPlaygroundItem({ ...editingPlaygroundItem, externalLink: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="edit-featured"
                      type="checkbox"
                      checked={editingPlaygroundItem.featured || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditingPlaygroundItem({ ...editingPlaygroundItem, featured: e.target.checked })
                      }
                      className="size-4 rounded border-border bg-input-background focus:ring-2 focus:ring-ring"
                    />
                    <label htmlFor="edit-featured" className="text-sm">
                      Featured (show on home page)
                    </label>
                  </div>

                  <div>
                    <label htmlFor="edit-score" className="block mb-2">
                      Score (1-5) <span className="text-muted-foreground">- Controls display order</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        id="edit-score"
                        value={editingPlaygroundItem.score || 5}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                          setEditingPlaygroundItem({ ...editingPlaygroundItem, score: parseInt(e.target.value) })
                        }
                        className="flex-1 px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value={5}>5 - Highest (Shows First)</option>
                        <option value={4}>4 - High</option>
                        <option value={3}>3 - Medium</option>
                        <option value={2}>2 - Low</option>
                        <option value={1}>1 - Lowest (Shows Last)</option>
                      </select>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Items with higher scores appear first. Use "Reorder All" to fine-tune order within each score group.
                    </p>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={savePlaygroundItem}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      {uploadingFile ? "Uploading..." : "Save Changes"}
                    </button>
                    <button
                      onClick={closeSheet}
                      className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-[var(--radius-button)] hover:opacity-80 transition-opacity"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Reorder Sheet */}


      {/* Work Experience Edit Sheet */}
      {isWorkExperienceSheetOpen && editingWorkExperience && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
            onClick={() => {
              setIsWorkExperienceSheetOpen(false);
              setTimeout(() => setEditingWorkExperience(null), 300);
            }}
          />

          {/* Sheet */}
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2>{editingWorkExperience.id.startsWith('exp-') && !workExperience.find(exp => exp.id === editingWorkExperience.id) ? 'Add' : 'Edit'} Work Experience</h2>
                <button
                  onClick={() => {
                    setIsWorkExperienceSheetOpen(false);
                    setTimeout(() => setEditingWorkExperience(null), 300);
                  }}
                  className="p-2 hover:bg-muted rounded-[var(--radius-button)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Start Year */}
                <div>
                  <label htmlFor="startYear" className="block mb-2">
                    Start Year
                  </label>
                  <select
                    id="startYear"
                    value={editingWorkExperience.startYear}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, startYear: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* End Year */}
                <div>
                  <label htmlFor="endYear" className="block mb-2">
                    End Year (Optional - leave empty for "Present")
                  </label>
                  <select
                    id="endYear"
                    value={editingWorkExperience.endYear || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, endYear: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Present</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="block mb-2">
                    Position
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={editingWorkExperience.position}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, position: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Product Designer at"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={editingWorkExperience.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, company: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Company Name"
                  />
                </div>

                {/* Company Logo */}
                <div>
                  <label htmlFor="companyLogo" className="block mb-2">
                    Company Logo
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="companyLogo"
                      type="text"
                      value={editingWorkExperience.companyLogo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, companyLogo: e.target.value })}
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="https://... or select a file"
                      disabled={!!pendingCompanyLogoFile}
                    />
                    <label className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity cursor-pointer">
                      Select File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPendingCompanyLogoFile(file);
                            const previewUrl = URL.createObjectURL(file);
                            setCompanyLogoPreview(previewUrl);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {pendingCompanyLogoFile && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Selected: {pendingCompanyLogoFile.name} (will upload on save)
                    </div>
                  )}
                  {(companyLogoPreview || editingWorkExperience.companyLogo) && (
                    <img
                      src={companyLogoPreview || editingWorkExperience.companyLogo}
                      alt="Company logo preview"
                      className="mt-2 w-16 h-16 object-cover rounded-[var(--radius)]"
                    />
                  )}
                </div>

                {/* Company Link */}
                <div>
                  <label htmlFor="companyLink" className="block mb-2">
                    Company Link (Optional)
                  </label>
                  <input
                    id="companyLink"
                    type="url"
                    value={editingWorkExperience.companyLink || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditingWorkExperience({ ...editingWorkExperience, companyLink: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://company.com"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Company name will be clickable with hover underline on the About page
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={saveWorkExperience}
                    disabled={loading || !editingWorkExperience.startYear || !editingWorkExperience.position || !editingWorkExperience.company}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsWorkExperienceSheetOpen(false);
                      setPendingCompanyLogoFile(null);
                      setCompanyLogoPreview(null);
                      setTimeout(() => setEditingWorkExperience(null), 300);
                    }}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity border border-border"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}