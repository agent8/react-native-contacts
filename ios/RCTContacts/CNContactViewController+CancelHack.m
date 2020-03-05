//
//  CNContactViewController+CancelHack.m
//  RCTContacts
//
//  Created by 王亮 on 2020/3/5.
//  Copyright © 2020 rt2zz. All rights reserved.
//

#import "CNContactViewController+CancelHack.h"

@import ObjectiveC.runtime;

@implementation CNContactViewController (iOS13BugFix)
+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];

        // On iOS 13 hitting "cancel" on the CNContactViewController
        // presents the discard action sheet behind the keyboard.
        // We swizzle the cancel callback and force the keyboard to
        // dismiss.
        if (@available(iOS 14, *)) {
            NSLog(@"Check if this is still needed.");
        } else if (@available(iOS 13, *)) {
            SEL originalSelector = @selector(editCancel:);
            SEL swizzledSelector = @selector(cancelHack:);

            Method originalMethod = class_getInstanceMethod(class, originalSelector);
            Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

            method_exchangeImplementations(originalMethod, swizzledMethod);
        }
    });
}

- (void)cancelHack:(UIBarButtonItem *)sender
{
    NSLog(@"==============");
//    [UIApplication.sharedApplication sendAction:@selector(resignFirstResponder) to:nil from:nil forEvent:nil];
//    [self.view endEditing:YES];
//    [sender.target resignFirstResponder];
    [self dismissViewControllerAnimated:YES completion:nil]; // ok
//    [[[UIApplication sharedApplication] keyWindow] endEditing:YES];

//
//        UITapGestureRecognizer *tapGR = [[UITapGestureRecognizer alloc] initWithTarget:self.view action:@selector(cancelHack:)];
//        tapGR.cancelsTouchesInView = NO;
//
//        [self.view addGestureRecognizer:tapGR];
//    [self.view endEditing:YES];
//    [[self view] endEditing:YES];
    
//     dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//
//         [self dismissViewControllerAnimated:YES completion:nil];
//
//     });
    
        [self cancelHack:sender];
}

@end
