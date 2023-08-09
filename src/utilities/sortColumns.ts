import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

export function sortRowsBySelection(spreadSheetData: [], setSpreadSheetData: React.Dispatch<React.SetStateAction<[] | undefined>>, selectedColumnToSort: any, isDescendingActive: boolean, currentWorkSpace: ICurrentWspContext) {
    const currentUnsortedSpreadData = spreadSheetData;

    if (selectedColumnToSort.length === 0) {
        setSpreadSheetData(
            currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
        );
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