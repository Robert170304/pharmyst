import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button as UIButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPharmacyWeeklyHours, updatePharmacyWeeklyHours } from "@/lib/api";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

function WeeklyHours() {
  const [weeklyHours, setWeeklyHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  console.log("🚀 ~ WeeklyHours ~ weeklyHours:", weeklyHours);
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    setLoading(true);
    getPharmacyWeeklyHours()
      .then((data) => {
        if (Array.isArray(data)) setWeeklyHours(data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to fetch weekly hours.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Add a function to check for any errors in weeklyHours
  const hasWeeklyHoursError = weeklyHours.some(
    (row) => !row.closed && row.close && row.open && row.close <= row.open
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePharmacyWeeklyHours(weeklyHours);
      toast({
        title: "Success",
        description: "Working hours updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update weekly hours.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={32} />
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Weekly Hours</CardTitle>
        <CardDescription>
          Set your pharmacy's open and close times for each day. Mark as closed
          if not open that day.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>Close</TableHead>
                <TableHead>Closed</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyHours.map((row, idx) => (
                <TableRow key={row.day}>
                  <TableCell>
                    <Select
                      value={row.day}
                      onValueChange={(val) => {
                        if (
                          weeklyHours.some((h, i) => h.day === val && i !== idx)
                        )
                          return;
                        setWeeklyHours((prev) =>
                          prev.map((h, i) =>
                            i === idx ? { ...h, day: val } : h
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDays.map((d) => (
                          <SelectItem
                            key={d}
                            value={d}
                            disabled={weeklyHours.some(
                              (h, i) => h.day === d && i !== idx
                            )}
                          >
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={row.open}
                      disabled={row.closed}
                      aria-label={`Open time for ${row.day}`}
                      placeholder="Open time"
                      onChange={(e) => {
                        const newOpen = e.target.value;
                        setWeeklyHours((prev) =>
                          prev.map((h, i) =>
                            i === idx
                              ? {
                                  ...h,
                                  open: newOpen,
                                  close: h.close <= newOpen ? "" : h.close,
                                }
                              : h
                          )
                        );
                      }}
                      className="w-28"
                      step="900"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={row.close}
                      disabled={row.closed}
                      aria-label={`Close time for ${row.day}`}
                      placeholder="Close time"
                      onChange={(e) => {
                        const newClose = e.target.value;
                        setWeeklyHours((prev) =>
                          prev.map((h, i) =>
                            i === idx ? { ...h, close: newClose } : h
                          )
                        );
                      }}
                      className="w-28"
                      step="900"
                    />
                    {row.close &&
                      row.open &&
                      row.close <= row.open &&
                      !row.closed && (
                        <p className="text-xs text-red-500 mt-1">
                          Close time must be after open time.
                        </p>
                      )}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.closed}
                      aria-label={`Closed on ${row.day}`}
                      onCheckedChange={(checked) =>
                        setWeeklyHours((prev) =>
                          prev.map((h, i) =>
                            i === idx ? { ...h, closed: !!checked } : h
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <UIButton
                      type="button"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 rounded p-1"
                      onClick={() =>
                        setWeeklyHours((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      aria-label={`Delete ${row.day}`}
                    >
                      <Trash2 size={18} />
                    </UIButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end p-4 gap-2">
            <UIButton
              type="button"
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => {
                const used = weeklyHours.map((h) => h.day);
                const nextDay = allDays.find((d) => !used.includes(d));
                if (nextDay)
                  setWeeklyHours((prev) => [
                    ...prev,
                    {
                      day: nextDay,
                      open: "08:00",
                      close: "22:00",
                      closed: false,
                    },
                  ]);
              }}
              disabled={
                weeklyHours.length >= 7 || hasWeeklyHoursError || saving
              }
              aria-label="Add day"
            >
              <Plus size={16} /> Add Day
            </UIButton>
            <UIButton
              type="button"
              variant="default"
              className="flex items-center gap-2"
              onClick={handleSave}
              disabled={hasWeeklyHoursError || saving}
              aria-label="Save weekly hours"
            >
              {saving ? <Loader size={18} className="mr-2" /> : null}
              {saving ? "Saving..." : "Save Hours"}
            </UIButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklyHours;
