// types/policies.ts
export interface SubPolicy {
    id: string;
    content: string;
  }
  
  export interface Policy {
    id: string;
    title: string;
    subPolicies: SubPolicy[];
  }
  
  // configs/policies.ts
  const policies: Policy[] = [
    {
      id: "evidence-liability",
      title: "1. Evidence and Liability",
      subPolicies: [
        {
          id: "evidence-1",
          content: "Content on this website cannot be used as evidence against the website owner in any legal proceedings or disputes."
        },
        {
          id: "evidence-2",
          content: "All content is provided 'as is' without any warranties or guarantees."
        },
        {
          id: "evidence-3",
          content: "Users acknowledge that any interpretations or conclusions drawn from website content are their own responsibility."
        },
        {
          id: "evidence-4",
          content: "Screenshots, archived versions, or other reproductions of this website's content cannot be used as legal evidence against the owner."
        }
      ]
    },
    {
      id: "user-conduct",
      title: "2. User Conduct",
      subPolicies: [
        {
          id: "conduct-1",
          content: "Users must be at least 13 years old to access this website."
        },
        {
          id: "conduct-2",
          content: "Users agree not to misuse, disrupt, or exploit the website's services."
        },
        {
          id: "conduct-3",
          content: "Any attempt to reverse engineer, hack, or compromise the website is strictly prohibited."
        },
        {
          id: "conduct-4",
          content: "Users are responsible for maintaining the confidentiality of their account credentials."
        }
      ]
    },
    {
      id: "content-usage",
      title: "3. Content Usage",
      subPolicies: [
        {
          id: "usage-1",
          content: "All content is protected by copyright and intellectual property laws."
        },
        {
          id: "usage-2",
          content: "Users may not reproduce, distribute, or modify any content without explicit permission."
        },
        {
          id: "usage-3",
          content: "Content sharing is limited to personal, non-commercial use only."
        },
        {
          id: "usage-4",
          content: "Attribution must be provided when sharing any content, where permitted."
        }
      ]
    },
    {
      id: "privacy-data",
      title: "4. Privacy and Data",
      subPolicies: [
        {
          id: "privacy-1",
          content: "User data collection is limited to essential website operations."
        },
        {
          id: "privacy-2",
          content: "Personal information will not be shared with third parties without consent."
        },
        {
          id: "privacy-3",
          content: "Users have the right to request their data be deleted."
        },
        {
          id: "privacy-4",
          content: "Cookies are used to enhance user experience and site functionality."
        }
      ]
    },
    {
      id: "disclaimer",
      title: "5. Disclaimer",
      subPolicies: [
        {
          id: "disclaimer-1",
          content: "The website owner is not liable for any damages arising from website use."
        },
        {
          id: "disclaimer-2",
          content: "Service interruptions may occur without prior notice."
        },
        {
          id: "disclaimer-3",
          content: "External links are provided for convenience only; we are not responsible for third-party content."
        },
        {
          id: "disclaimer-4",
          content: "We reserve the right to modify these policies at any time."
        }
      ]
    }
  ];
  
export const siteMetadata = {
    lastUpdated: "October 22, 2024",
    contactEmail: "ulricaird@icloud.com"
};

export default policies;