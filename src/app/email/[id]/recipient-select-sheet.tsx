"use client";

import { useState, useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, X, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"

type AirtableFields = {
    Name?: string;
    "Last Name"?: string;
    Priority?: string;
    Email?: string;
};  

type AirtableRecord = {
    id: string;
    fields: AirtableFields;
};

type AirtableResponse = {
    records: AirtableRecord[];
}

export default function RecipientSelectSheet({peopledata}: {peopledata: AirtableResponse}) {
    const [recipients, setRecipients] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const toggleRecipient = (personId: string) => {
        setRecipients((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(personId)) {
                newSet.delete(personId);
            } else {
                newSet.add(personId);
            }
            return newSet;
        });
    };

    const filteredRecords = useMemo(() => {
        if (!searchQuery.trim()) {
            return peopledata.records;
        }
        const query = searchQuery.toLowerCase();
        return peopledata.records.filter((person) => {
            const name = `${person.fields.Name || ""} ${person.fields["Last Name"] || ""}`.toLowerCase();
            const email = (person.fields.Email || "").toLowerCase();
            return name.includes(query) || email.includes(query);
        });
    }, [peopledata.records, searchQuery]);

    const selectedCount = recipients.size;
    const selectedRecords = peopledata.records.filter((person) => recipients.has(person.id));

    const handleSend = () => {
        console.log("Sending to recipients:", selectedRecords);
        // TODO: Implement actual email sending
    };
    
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Select Recipients and Send
                        {selectedCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {selectedCount}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader className="px-6">
                        <SheetTitle>Select Email Recipients</SheetTitle>
                        <SheetDescription>
                            Choose recipients from the list below. {selectedCount > 0 && `${selectedCount} recipient${selectedCount !== 1 ? 's' : ''} selected.`}
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-4 px-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Selected Recipients Summary */}
                        {selectedCount > 0 && (
                            <div className="space-y-2">
                                <Label>Selected Recipients ({selectedCount})</Label>
                                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30 max-h-32 overflow-y-auto">
                                    {selectedRecords.map((person) => (
                                        <Badge
                                            key={person.id}
                                            variant="default"
                                            className="gap-1 pr-1"
                                        >
                                            <User className="h-3 w-3" />
                                            {person.fields.Name} {person.fields["Last Name"]}
                                            <button
                                                onClick={() => toggleRecipient(person.id)}
                                                className="ml-1 hover:bg-primary/80 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recipients List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>All Recipients ({filteredRecords.length})</Label>
                                {filteredRecords.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (selectedCount === filteredRecords.length) {
                                                setRecipients(new Set());
                                            } else {
                                                setRecipients(new Set(filteredRecords.map((r) => r.id)));
                                            }
                                        }}
                                    >
                                        {selectedCount === filteredRecords.length ? "Deselect All" : "Select All"}
                                    </Button>
                                )}
                            </div>
                            <div className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
                                {filteredRecords.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>No recipients found</p>
                                        {searchQuery && (
                                            <p className="text-sm mt-2">Try a different search term</p>
                                        )}
                                    </div>
                                ) : (
                                    filteredRecords.map((person) => {
                                        const isSelected = recipients.has(person.id);
                                        const fullName = `${person.fields.Name || ""} ${person.fields["Last Name"] || ""}`.trim();
                                        const email = person.fields.Email || "No email";
                                        
                                        return (
                                            <div
                                                key={person.id}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                                                    isSelected && "bg-primary/5"
                                                )}
                                                onClick={() => toggleRecipient(person.id)}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleRecipient(person.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium truncate">{fullName || "Unnamed"}</p>
                                                        {person.fields.Priority && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {person.fields.Priority}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">{email}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="mt-6 px-6">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-sm text-muted-foreground">
                                {selectedCount > 0 ? (
                                    <span>{selectedCount} recipient{selectedCount !== 1 ? 's' : ''} selected</span>
                                ) : (
                                    <span>No recipients selected</span>
                                )}
                            </div>
                            <Button 
                                type="button" 
                                onClick={handleSend}
                                disabled={selectedCount === 0}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email{selectedCount > 0 ? ` (${selectedCount})` : ''}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}