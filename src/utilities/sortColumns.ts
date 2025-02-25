import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortRowsBySelection(spreadSheetData: any[], setSpreadSheetData: React.Dispatch<React.SetStateAction<any[]>>, selectedColumnToSort: any, isDescendingActive: boolean, currentWorkSpace: ICurrentWspContext) {
    const currentUnsortedSpreadData = spreadSheetData;

    if (selectedColumnToSort.length === 0) {
        setSpreadSheetData(currentWorkSpace?.currentWorkSpace?.container?.spreadSheetData?.data ?? []);
        return;
    }

    if (
        selectedColumnToSort[selectedColumnToSort?.length - 1].type === "number"
    ) {
        if (isDescendingActive) {
            currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
                return (
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
                    ] -
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
                    ]
                );
            });
        } else {
            currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
                return (
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
                    ] -
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
                    ]
                );
            });
        }
    }

    if (
        selectedColumnToSort[selectedColumnToSort?.length - 1].type === "boolean"
    ) {
        if (isDescendingActive) {
            currentUnsortedSpreadData.sort(function (beforeIndex, currentIndex) {
                return beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                ] ===
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                    ? 0
                    : beforeIndex[
                        selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                        ? -1
                        : 1;
            });
        } else {
            currentUnsortedSpreadData.sort(function (beforeIndex, currentIndex) {
                return beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                ] ===
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                    ? 0
                    : beforeIndex[
                        selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                        ? 1
                        : -1;
            });
        }
    }

    if (
        selectedColumnToSort[selectedColumnToSort?.length - 1].type === "string"
    ) {
        if (isDescendingActive) {
            currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
                if (
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ] <
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                ) {
                    return -1;
                }
                if (
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ] >
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                ) {
                    return 1;
                }
                return 0;
            });
        } else {
            currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
                if (
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ] >
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                ) {
                    return -1;
                }
                if (
                    beforeIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ] <
                    currentIndex[
                    selectedColumnToSort[selectedColumnToSort?.length - 1].value
                    ]
                ) {
                    return 1;
                }
                return 0;
            });
        }
    }

    setSpreadSheetData(currentUnsortedSpreadData);
}