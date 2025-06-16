"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Criterion, CriterionOption } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminPanel() {
  const {
    platformTypes,
    addPlatformType,
    updatePlatformType,
    deletePlatformType,
    addCriterion,
    updateCriterion,
    deleteCriterion,
    addCriterionOption,
    updateCriterionOption,
    deleteCriterionOption,
    normalizeCriteriaWeights,
  } = useStore()
  const { toast } = useToast()

  const [selectedPlatformTypeId, setSelectedPlatformTypeId] = useState<string | null>(null)
  const [newPlatformType, setNewPlatformType] = useState({ name: "", description: "" })
  const [newCriterion, setNewCriterion] = useState({ name: "", description: "", weight: 0 })
  const [newOption, setNewOption] = useState({ label: "", value: 0, description: "" })
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null)
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  const [editingCriterion, setEditingCriterion] = useState<Partial<Criterion>>({})
  const [editingOption, setEditingOption] = useState<Partial<CriterionOption>>({})

  const selectedPlatformType = platformTypes.find((pt) => pt.id === selectedPlatformTypeId) || null

  const handleAddPlatformType = () => {
    if (!newPlatformType.name) {
      toast({
        title: "Missing information",
        description: "Platform type name is required",
        variant: "destructive",
      })
      return
    }

    const id = addPlatformType(newPlatformType)
    setSelectedPlatformTypeId(id)
    setNewPlatformType({ name: "", description: "" })

    toast({
      title: "Platform type added",
      description: `${newPlatformType.name} has been added successfully`,
    })
  }

  const handleDeletePlatformType = (id: string) => {
    deletePlatformType(id)
    if (selectedPlatformTypeId === id) {
      setSelectedPlatformTypeId(null)
    }

    toast({
      title: "Platform type deleted",
      description: "The platform type has been deleted successfully",
    })
  }

  const handleAddCriterion = () => {
    if (!selectedPlatformTypeId || !newCriterion.name) {
      toast({
        title: "Missing information",
        description: "Criterion name is required",
        variant: "destructive",
      })
      return
    }

    addCriterion(selectedPlatformTypeId, {
      ...newCriterion,
      weight: newCriterion.weight || 0,
    })

    setNewCriterion({ name: "", description: "", weight: 0 })

    toast({
      title: "Criterion added",
      description: `${newCriterion.name} has been added successfully`,
    })
  }

  const handleUpdateCriterion = () => {
    if (!selectedPlatformTypeId || !editingCriterionId || !editingCriterion.name) {
      return
    }

    updateCriterion(selectedPlatformTypeId, editingCriterionId, editingCriterion)
    setEditingCriterionId(null)
    setEditingCriterion({})

    toast({
      title: "Criterion updated",
      description: "The criterion has been updated successfully",
    })
  }

  const handleDeleteCriterion = (criterionId: string) => {
    if (!selectedPlatformTypeId) return

    deleteCriterion(selectedPlatformTypeId, criterionId)

    toast({
      title: "Criterion deleted",
      description: "The criterion has been deleted successfully",
    })
  }

  const handleAddOption = (criterionId: string) => {
    if (!selectedPlatformTypeId || !newOption.label) {
      toast({
        title: "Missing information",
        description: "Option label is required",
        variant: "destructive",
      })
      return
    }

    addCriterionOption(selectedPlatformTypeId, criterionId, newOption)
    setNewOption({ label: "", value: 0, description: "" })

    toast({
      title: "Option added",
      description: `${newOption.label} has been added successfully`,
    })
  }

  const handleUpdateOption = (criterionId: string) => {
    if (!selectedPlatformTypeId || !criterionId || !editingOptionId || !editingOption.label) {
      return
    }

    updateCriterionOption(selectedPlatformTypeId, criterionId, editingOptionId, editingOption)
    setEditingOptionId(null)
    setEditingOption({})

    toast({
      title: "Option updated",
      description: "The option has been updated successfully",
    })
  }

  const handleDeleteOption = (criterionId: string, optionId: string) => {
    if (!selectedPlatformTypeId) return

    deleteCriterionOption(selectedPlatformTypeId, criterionId, optionId)

    toast({
      title: "Option deleted",
      description: "The option has been deleted successfully",
    })
  }

  const handleNormalizeWeights = () => {
    if (!selectedPlatformTypeId) return

    normalizeCriteriaWeights(selectedPlatformTypeId)

    toast({
      title: "Weights normalized",
      description: "Criteria weights have been normalized to sum to 100%",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculator Administration</CardTitle>
        <CardDescription>Configure platform types, criteria, and scoring options</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="platform-types" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platform-types">Platform Types</TabsTrigger>
            <TabsTrigger value="criteria-management" disabled={!selectedPlatformType}>
              Criteria Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform-types" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Available Platform Types</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Platform Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Platform Type</DialogTitle>
                    <DialogDescription>Create a new platform type for security evaluation</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newPlatformType.name}
                        onChange={(e) => setNewPlatformType({ ...newPlatformType, name: e.target.value })}
                        placeholder="e.g., SaaS, Mobile App"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newPlatformType.description}
                        onChange={(e) => setNewPlatformType({ ...newPlatformType, description: e.target.value })}
                        placeholder="Brief description of this platform type"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPlatformType}>Add Platform Type</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {platformTypes.map((platformType) => (
                <Card
                  key={platformType.id}
                  className={selectedPlatformTypeId === platformType.id ? "border-primary" : ""}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{platformType.name}</CardTitle>
                        <CardDescription>{platformType.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedPlatformTypeId === platformType.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPlatformTypeId(platformType.id)}
                        >
                          {selectedPlatformTypeId === platformType.id ? "Selected" : "Select"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Platform Type</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {platformType.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePlatformType(platformType.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">{platformType.criteria.length} criteria defined</p>
                  </CardContent>
                </Card>
              ))}

              {platformTypes.length === 0 && (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">No platform types defined yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add a platform type to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="criteria-management" className="space-y-4 pt-4">
            {selectedPlatformType && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedPlatformType.name} Criteria</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlatformType.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Criterion
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Criterion</DialogTitle>
                          <DialogDescription>
                            Create a new evaluation criterion for {selectedPlatformType.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="criterion-name">Name</Label>
                            <Input
                              id="criterion-name"
                              value={newCriterion.name}
                              onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                              placeholder="e.g., Data Location, Authentication"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="criterion-description">Description</Label>
                            <Input
                              id="criterion-description"
                              value={newCriterion.description}
                              onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
                              placeholder="Brief description of this criterion"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="criterion-weight">Weight (%)</Label>
                            <Input
                              id="criterion-weight"
                              type="number"
                              min="0"
                              max="100"
                              value={newCriterion.weight}
                              onChange={(e) =>
                                setNewCriterion({ ...newCriterion, weight: Number.parseInt(e.target.value) || 0 })
                              }
                              placeholder="Weight as percentage (0-100)"
                            />
                            <p className="text-xs text-muted-foreground">
                              Weights will be automatically normalized to sum to 100%
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCriterion}>Add Criterion</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" onClick={handleNormalizeWeights}>
                      Normalize Weights
                    </Button>
                  </div>
                </div>

                <Accordion type="multiple" className="w-full">
                  {selectedPlatformType.criteria.map((criterion) => (
                    <AccordionItem key={criterion.id} value={criterion.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>{criterion.name}</span>
                          <span className="text-sm text-muted-foreground">Weight: {criterion.weight}%</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">{criterion.description}</p>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Criterion</DialogTitle>
                                    <DialogDescription>Update this evaluation criterion</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-criterion-name">Name</Label>
                                      <Input
                                        id="edit-criterion-name"
                                        defaultValue={criterion.name}
                                        onChange={(e) =>
                                          setEditingCriterion({ ...editingCriterion, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-criterion-description">Description</Label>
                                      <Input
                                        id="edit-criterion-description"
                                        defaultValue={criterion.description}
                                        onChange={(e) =>
                                          setEditingCriterion({ ...editingCriterion, description: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-criterion-weight">Weight (%)</Label>
                                      <Input
                                        id="edit-criterion-weight"
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={criterion.weight}
                                        onChange={(e) =>
                                          setEditingCriterion({
                                            ...editingCriterion,
                                            weight: Number.parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        setEditingCriterionId(criterion.id)
                                        handleUpdateCriterion()
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Criterion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {criterion.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCriterion(criterion.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">Options</h4>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Option
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Option</DialogTitle>
                                    <DialogDescription>Create a new option for {criterion.name}</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="option-label">Label</Label>
                                      <Input
                                        id="option-label"
                                        value={newOption.label}
                                        onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                                        placeholder="e.g., Yes, No, Partial"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="option-value">Value (0-100)</Label>
                                      <Input
                                        id="option-value"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newOption.value}
                                        onChange={(e) =>
                                          setNewOption({ ...newOption, value: Number.parseInt(e.target.value) || 0 })
                                        }
                                        placeholder="Score value (0-100)"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="option-description">Description (Optional)</Label>
                                      <Input
                                        id="option-description"
                                        value={newOption.description || ""}
                                        onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                                        placeholder="Additional details about this option"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={() => handleAddOption(criterion.id)}>Add Option</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="space-y-2">
                              {criterion.options.map((option) => (
                                <Card key={option.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">{option.label}</p>
                                        <p className="text-sm text-muted-foreground">Score: {option.value}/100</p>
                                        {option.description && (
                                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm" variant="ghost">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Edit Option</DialogTitle>
                                              <DialogDescription>
                                                Update this option for {criterion.name}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                              <div className="grid gap-2">
                                                <Label htmlFor="edit-option-label">Label</Label>
                                                <Input
                                                  id="edit-option-label"
                                                  defaultValue={option.label}
                                                  onChange={(e) =>
                                                    setEditingOption({ ...editingOption, label: e.target.value })
                                                  }
                                                />
                                              </div>
                                              <div className="grid gap-2">
                                                <Label htmlFor="edit-option-value">Value (0-100)</Label>
                                                <Input
                                                  id="edit-option-value"
                                                  type="number"
                                                  min="0"
                                                  max="100"
                                                  defaultValue={option.value}
                                                  onChange={(e) =>
                                                    setEditingOption({
                                                      ...editingOption,
                                                      value: Number.parseInt(e.target.value) || 0,
                                                    })
                                                  }
                                                />
                                              </div>
                                              <div className="grid gap-2">
                                                <Label htmlFor="edit-option-description">Description (Optional)</Label>
                                                <Input
                                                  id="edit-option-description"
                                                  defaultValue={option.description || ""}
                                                  onChange={(e) =>
                                                    setEditingOption({ ...editingOption, description: e.target.value })
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                onClick={() => {
                                                  setEditingOptionId(option.id)
                                                  handleUpdateOption(criterion.id)
                                                }}
                                              >
                                                Save Changes
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-destructive">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Option</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete the option "{option.label}"?
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleDeleteOption(criterion.id, option.id)}
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}

                              {criterion.options.length === 0 && (
                                <div className="text-center py-4 border rounded-lg">
                                  <p className="text-sm text-muted-foreground">No options defined yet</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Add options to enable scoring for this criterion
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {selectedPlatformType.criteria.length === 0 && (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">No criteria defined yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add criteria to enable security evaluation for this platform type
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
