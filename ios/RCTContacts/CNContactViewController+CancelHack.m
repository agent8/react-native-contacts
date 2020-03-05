//
//  CNContactViewController+CancelHack.m
//  RCTContacts
//
//  Created by Jun Wang on 2020/3/5.
//  Copyright © 2020 rt2zz. All rights reserved.
//

#import "CNContactViewController+CancelHack.h"
#import <objc/runtime.h>

@implementation CNContactViewController (CancelHack)
- (void)cancelHack {
    [[self delegate] contactViewController:self didCompleteWithContact:self.contact];
}

+ (void)swizzleEditCancelMethod {
    Method origMethod = class_getInstanceMethod([CNContactViewController class], @selector(editCancel:));
    Method newMethod = class_getInstanceMethod([CNContactViewController class], @selector(cancelHack));
    method_exchangeImplementations(origMethod, newMethod);
}

+ (void)revertEditCancelMethod {
    Method origMethod = class_getInstanceMethod([CNContactViewController class], @selector(cancelHack));
    Method newMethod = class_getInstanceMethod([CNContactViewController class], @selector(editCancel:));
    method_exchangeImplementations(origMethod, newMethod);
}

@end
