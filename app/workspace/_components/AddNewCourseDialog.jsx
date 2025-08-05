import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import  {useState}from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, Sparkle } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
function AppNewCourseDialog({children}) {
  
  const [loading, setLoading] = useState(false);

  const [formData, setFormData]=useState({
    name:'',
    description:'',
    includeCideo:false,
    noOfChapters:1,
    category:'',
    level:''
  });

  const onHandleInputChange=(field,value)=>{
    setFormData(prev=>({
      ...prev,
      [field]:value
    }))
    console.log(formData);
    
  }
  const router = useRouter();

  const onGenerate=async()=>{
    console.log(formData);
    const courseId = uuidv4();
    try{

      setLoading(true);
      const result = await axios.post('/api/geenerate-course-layout',
        {...formData,
          courseId : courseId

        });
      console.log(result.data);
      setLoading(false);
      router.push(`/workspace/course/` + result.data?.courseId);
    }

    catch(error){
      console.error("Error generating course layout:", error);
      setLoading(false);
    }
  }

  return (
    <Dialog>
  <DialogTrigger asChild>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Course Using AI  </DialogTitle>
      <DialogDescription asChild>
        <div className='flex flex-col gap-4 mt-3'> 
           <div>
              <label>Course Name </label>
              <Input placeholder="Course Name"
              onChange={(event)=>onHandleInputChange('Name',event?.target.value)}/>
           </div>
           <div>
              <label>Course Description(Optional) </label>
              <Textarea placeholder="Course Description"
              onChange={(event)=>onHandleInputChange('Description',event?.target.value)}/>
           </div>
            <div>
              <label>No. Of Chapters </label>
              <Input placeholder="No. Of Chapters" type='number'
               onChange={(event)=>onHandleInputChange('noOfChapters',event?.target.value)}/>
           </div>
             <div className='flex gap-3 items-center'>
              <label >Include Video</label>
                <Switch
                onCheckedChange={()=>onHandleInputChange('includeVideo',!formData?.includeVideo)} />
             </div>
             <div>
              <label className=''>Difficulty Level</label>
              <Select onValueChange={(value)=>onHandleInputChange('level',value)}>
                <SelectTrigger className="w-full">
                   <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                     <SelectItem value="advanced">Advanced</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div>
              <label>Category </label>
              <Input placeholder="Category(Seperated by Comma)"
               onChange={(event)=>onHandleInputChange('category',event?.target.value)}/>
           </div>

           <div className='mt-5'>
            <Button className={'w-full'} onClick={onGenerate} disabled={loading}>  
              {loading ? <Loader2Icon className='animate-spin'/>:
              <Sparkle />} Generate Course </Button>
           </div>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default AppNewCourseDialog