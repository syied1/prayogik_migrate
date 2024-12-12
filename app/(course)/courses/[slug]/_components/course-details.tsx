// @ts-nocheck
// Import required components and icons
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { FileIcon, CodeIcon } from "lucide-react";

// Course inclusion section, using a Shadcn Card component
// This card presents course features, with icons and text aligned
const CourseInclusions = ({course}) => {
  return (
    <Card className="p-0 border-none shadow-none">
      <CardContent className="flex items-start p-0">
        {/* Left section for video and coding exercises */}
        <div className="mr-10">
          <CardHeader className="p-0">
            {/* Title for course inclusions */}
            <h2 className="text-xl font-bold mb-4">This course includes:</h2>
          </CardHeader>

          {/* List of course items */}
          <ul className="space-y-2">
            {/* Each list item includes an icon and description */}
            <li className="flex gap-2 items-center">
              <FileIcon className="w-4 h-4 stroke-gray-400" />
              <span>52 hours on-demand video</span>
            </li>
            <li className="flex gap-2 items-center">
              <CodeIcon className="w-4 h-4 stroke-gray-400" />
              <span>23 coding exercises</span>
            </li>
            <li className="flex gap-2 items-center">
              <CodeIcon className="w-4 h-4 stroke-gray-400" />
              <span>23 coding exercises</span>
            </li>
          </ul>
        </div>

        {/* Right section for assignments and other inclusions */}
        <div>
          {/* Additional course items */}
          <ul className="space-y-2 mt-12">
            <li className="flex gap-2 items-center">
              <DocumentTextIcon className="w-4 h-4 stroke-gray-400" />
              <span>23 coding exercises</span>
            </li>
            <li className="flex gap-2 items-center">
              <CodeIcon className="w-4 h-4 stroke-gray-400" />
              <span>Assignments</span>
            </li>
            <li className="flex gap-2 items-center">
              <CodeIcon className="w-4 h-4 stroke-gray-400" />
              <span>23 coding exercises</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInclusions;
